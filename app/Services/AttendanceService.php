<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Exception;

/**
 * Service de gestion des pointages.
 * Gère le check-in, check-out, calcul des heures et des retards.
 */
class AttendanceService
{
    public function __construct(private GeoService $geoService) {}

    /**
     * Enregistrer l'arrivée d'un employé.
     *
     * @throws Exception Si l'employé a déjà pointé son arrivée aujourd'hui
     */
    public function checkIn(User $user, float $latitude, float $longitude): Attendance
    {
        $today = now()->toDateString();

        // 1. Vérifier si l'employé a déjà pointé aujourd'hui
        $existing = Attendance::withoutGlobalScope('company')
            ->where('user_id', $user->id)
            ->where('date', $today)
            ->whereNotNull('check_in')
            ->first();

        if ($existing) {
            throw new Exception('Vous avez déjà pointé votre arrivée aujourd\'hui.');
        }

        // 2. Vérifier la zone géographique
        if ($user->location_id) {
            // Zone assignée → l'employé DOIT être dans cette zone précise
            $assignedLocation = \App\Models\Location::find($user->location_id);
            if ($assignedLocation && !$this->geoService->isWithinRadius($latitude, $longitude, $assignedLocation)) {
                throw new Exception("Vous devez être dans votre zone assignée « {$assignedLocation->name} » pour pointer.");
            }
            $location    = $assignedLocation;
            $geoVerified = $location !== null;
        } else {
            // Pas de zone assignée → n'importe quelle zone active de l'entreprise
            $location    = $this->geoService->findNearestLocation($latitude, $longitude, $user->company_id);
            $geoVerified = $location !== null;
        }

        // 3. Récupérer les paramètres de l'entreprise
        $company          = $user->company;
        $workStartStr     = $company->getSetting('work_start', '08:00');
        $lateTolerance    = (int) $company->getSetting('late_tolerance_minutes', 15);

        // 4. Calculer le statut (présent ou en retard)
        $now          = Carbon::now();
        $workStart    = Carbon::createFromFormat('H:i', $workStartStr, $company->getSetting('timezone', 'Africa/Abidjan'));
        $workStart->setDate($now->year, $now->month, $now->day);

        $lateThreshold = $workStart->copy()->addMinutes($lateTolerance);
        $lateMinutes   = 0;
        $status        = 'present';

        if ($now->greaterThan($lateThreshold)) {
            $status      = 'late';
            $lateMinutes = (int) $now->diffInMinutes($workStart);
        }

        // 5. Créer ou mettre à jour le pointage du jour
        $attendance = Attendance::withoutGlobalScope('company')
            ->updateOrCreate(
                [
                    'user_id' => $user->id,
                    'date'    => $today,
                ],
                [
                    'company_id'          => $user->company_id,
                    'check_in'            => $now,
                    'check_in_latitude'   => $latitude,
                    'check_in_longitude'  => $longitude,
                    'check_in_location_id'=> $location?->id,
                    'status'              => $status,
                    'late_minutes'        => $lateMinutes,
                    'is_geo_verified'     => $geoVerified,
                ]
            );

        // 6. Journaliser l'activité
        ActivityLog::create([
            'company_id'   => $user->company_id,
            'user_id'      => $user->id,
            'action'       => 'check_in',
            'description'  => "Pointage arrivée — statut: {$status}" . ($lateMinutes > 0 ? " (retard: {$lateMinutes} min)" : ''),
            'subject_type' => Attendance::class,
            'subject_id'   => $attendance->id,
            'properties'   => [
                'latitude'      => $latitude,
                'longitude'     => $longitude,
                'location_id'   => $location?->id,
                'location_name' => $location?->name,
                'geo_verified'  => $geoVerified,
                'late_minutes'  => $lateMinutes,
            ],
            'ip_address'   => request()->ip(),
        ]);

        return $attendance->fresh(['user', 'checkInLocation']);
    }

    /**
     * Enregistrer le départ d'un employé.
     *
     * @throws Exception Si l'employé n'a pas encore pointé son arrivée
     */
    public function checkOut(User $user, float $latitude, float $longitude): Attendance
    {
        $today = now()->toDateString();

        // 1. Récupérer le pointage du jour
        $attendance = Attendance::withoutGlobalScope('company')
            ->where('user_id', $user->id)
            ->where('date', $today)
            ->whereNotNull('check_in')
            ->whereNull('check_out')
            ->first();

        if (!$attendance) {
            throw new Exception('Aucun pointage d\'arrivée trouvé pour aujourd\'hui, ou vous avez déjà pointé votre départ.');
        }

        // 2. Trouver la zone géographique la plus proche
        $location = $this->geoService->findNearestLocation($latitude, $longitude, $user->company_id);

        // 3. Calculer les heures travaillées
        $now         = Carbon::now();
        $workedHours = $this->calculateWorkedHours($attendance, $now, $user->company);

        // 4. Calculer les heures supplémentaires
        $workEndStr       = $user->company->getSetting('work_end', '17:00');
        $workEnd          = Carbon::createFromFormat('H:i', $workEndStr, $user->company->getSetting('timezone', 'Africa/Abidjan'));
        $workEnd->setDate($now->year, $now->month, $now->day);

        $standardHours  = $workEnd->diffInMinutes(
            Carbon::createFromFormat('H:i', $user->company->getSetting('work_start', '08:00'))
                ->setDate($now->year, $now->month, $now->day)
        ) / 60;

        $overtimeHours = max(0, $workedHours - $standardHours);

        // 5. Mettre à jour le statut si demi-journée
        $status = $attendance->status;
        if ($workedHours < ($standardHours / 2)) {
            $status = 'half_day';
        }

        // 6. Mettre à jour le pointage
        $attendance->update([
            'check_out'             => $now,
            'check_out_latitude'    => $latitude,
            'check_out_longitude'   => $longitude,
            'check_out_location_id' => $location?->id,
            'worked_hours'          => $workedHours,
            'overtime_hours'        => $overtimeHours,
            'status'                => $status,
        ]);

        // 7. Journaliser l'activité
        ActivityLog::create([
            'company_id'   => $user->company_id,
            'user_id'      => $user->id,
            'action'       => 'check_out',
            'description'  => "Pointage départ — heures travaillées: " . number_format($workedHours, 2) . "h",
            'subject_type' => Attendance::class,
            'subject_id'   => $attendance->id,
            'properties'   => [
                'latitude'      => $latitude,
                'longitude'     => $longitude,
                'location_id'   => $location?->id,
                'worked_hours'  => $workedHours,
                'overtime_hours'=> $overtimeHours,
            ],
            'ip_address'   => request()->ip(),
        ]);

        return $attendance->fresh(['user', 'checkInLocation', 'checkOutLocation']);
    }

    /**
     * Calculer les heures travaillées en tenant compte de la pause déjeuner.
     */
    public function calculateWorkedHours(Attendance $attendance, ?Carbon $checkOut = null, ?object $company = null): float
    {
        $checkIn  = Carbon::parse($attendance->check_in);
        $checkOut = $checkOut ?? Carbon::parse($attendance->check_out);

        if (!$checkOut) {
            return 0;
        }

        $totalMinutes = $checkIn->diffInMinutes($checkOut);

        // Déduire la pause déjeuner si applicable
        if ($company) {
            $lunchMinutes = (int) $company->getSetting('lunch_break_minutes', 60);
            $workHours    = $totalMinutes / 60;

            // Déduire la pause uniquement si plus de 5h travaillées
            if ($workHours > 5 && $lunchMinutes > 0) {
                $totalMinutes -= $lunchMinutes;
            }
        }

        return max(0, round($totalMinutes / 60, 2));
    }

    /**
     * Marquer automatiquement les absents après le délai configuré.
     * Appelé par le scheduler quotidiennement.
     */
    public function markAbsentees(): void
    {
        $today = now()->toDateString();

        // Récupérer toutes les companies actives
        $companies = \App\Models\Company::where('is_active', true)->get();

        foreach ($companies as $company) {
            // Ne marquer les absents que sur les jours ouvrés configurés
            if (!$company->isWorkingDay(now())) {
                continue;
            }

            $autoAbsentMinutes = (int) $company->getSetting('auto_absent_after_minutes', 120);
            $workStart         = $company->getSetting('work_start', '08:00');

            $absentThreshold = Carbon::createFromFormat('H:i', $workStart, $company->getSetting('timezone', 'Africa/Abidjan'))
                ->setDate(now()->year, now()->month, now()->day)
                ->addMinutes($autoAbsentMinutes);

            // Ne marquer les absents que si le seuil est dépassé
            if (now()->lessThan($absentThreshold)) {
                continue;
            }

            // Récupérer les employés actifs de la company sans pointage aujourd'hui
            $employees = User::withoutGlobalScope('company')
                ->where('company_id', $company->id)
                ->where('is_active', true)
                ->whereIn('role', ['employee', 'manager'])
                ->get();

            foreach ($employees as $employee) {
                $hasAttendance = Attendance::withoutGlobalScope('company')
                    ->where('user_id', $employee->id)
                    ->where('date', $today)
                    ->exists();

                if (!$hasAttendance) {
                    Attendance::create([
                        'user_id'    => $employee->id,
                        'company_id' => $company->id,
                        'date'       => $today,
                        'status'     => 'absent',
                    ]);
                }
            }
        }
    }
}
