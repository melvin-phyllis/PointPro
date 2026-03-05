<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Department;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

/**
 * Service de génération de rapports de présence.
 */
class ReportService
{
    /**
     * Statistiques du tableau de bord pour une date donnée.
     *
     * @param int         $companyId ID de l'entreprise
     * @param string|null $date      Date (par défaut: aujourd'hui)
     * @return array{total_employees: int, present: int, late: int, absent: int, excused: int, attendance_rate: float}
     */
    public function getDashboardStats(int $companyId, ?string $date = null): array
    {
        $date = $date ?? now()->toDateString();

        $totalEmployees = User::withoutGlobalScope('company')
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->whereIn('role', ['employee', 'manager', 'admin'])
            ->count();

        $attendances = Attendance::withoutGlobalScope('company')
            ->where('company_id', $companyId)
            ->where('date', $date)
            ->get();

        $present = $attendances->whereIn('status', ['present', 'late'])->count();
        $late    = $attendances->where('status', 'late')->count();
        $absent  = $attendances->where('status', 'absent')->count();
        $excused = $attendances->where('status', 'excused')->count();

        $attendanceRate = $totalEmployees > 0
            ? round(($present / $totalEmployees) * 100, 1)
            : 0;

        return [
            'total_employees' => $totalEmployees,
            'present'         => $present,
            'late'            => $late,
            'absent'          => $absent,
            'excused'         => $excused,
            'attendance_rate' => $attendanceRate,
            'date'            => $date,
        ];
    }

    /**
     * Statistiques des 5 derniers jours ouvrés.
     *
     * @param int $companyId ID de l'entreprise
     * @return array
     */
    public function getWeeklyStats(int $companyId): array
    {
        $company = \App\Models\Company::find($companyId);
        $stats   = [];
        $days    = 0;
        $date    = Carbon::today();

        // Récupérer les 7 derniers jours ouvrés selon la config de l'entreprise
        while ($days < 7) {
            if ($company->isWorkingDay($date)) {
                $dateStr  = $date->toDateString();
                $dayStats = $this->getDashboardStats($companyId, $dateStr);
                $stats[]  = array_merge($dayStats, [
                    'day_name' => $date->locale('fr')->isoFormat('ddd D/M'),
                ]);
            }
            $date->subDay();
            $days++;
        }

        return array_reverse($stats);
    }

    /**
     * Statistiques de présence par département.
     *
     * @param int         $companyId ID de l'entreprise
     * @param string|null $date      Date (par défaut: aujourd'hui)
     * @return array
     */
    public function getDepartmentStats(int $companyId, ?string $date = null): array
    {
        $date        = $date ?? now()->toDateString();
        $departments = Department::withoutGlobalScope('company')
            ->where('company_id', $companyId)
            ->withCount([
                'users as total_employees' => fn($q) => $q->where('is_active', true)->whereIn('role', ['employee', 'manager']),
            ])
            ->get();

        $stats = [];

        foreach ($departments as $dept) {
            // Récupérer les IDs des employés du département
            $employeeIds = User::withoutGlobalScope('company')
                ->where('department_id', $dept->id)
                ->where('is_active', true)
                ->pluck('id');

            $attendances = Attendance::withoutGlobalScope('company')
                ->whereIn('user_id', $employeeIds)
                ->where('date', $date)
                ->get();

            $present = $attendances->whereIn('status', ['present', 'late'])->count();
            $rate    = $dept->total_employees > 0
                ? round(($present / $dept->total_employees) * 100, 1)
                : 0;

            $stats[] = [
                'id'              => $dept->id,
                'name'            => $dept->name,
                'total_employees' => $dept->total_employees,
                'present'         => $present,
                'absent'          => $dept->total_employees - $present,
                'attendance_rate' => $rate,
            ];
        }

        return $stats;
    }

    /**
     * Rapport mensuel complet.
     *
     * @param int $companyId ID de l'entreprise
     * @param int $year      Année
     * @param int $month     Mois
     * @return array
     */
    public function getMonthlyReport(int $companyId, int $year, int $month): array
    {
        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate   = $startDate->copy()->endOfMonth();

        $attendances = Attendance::withoutGlobalScope('company')
            ->with('user')
            ->where('company_id', $companyId)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get();

        $company       = \App\Models\Company::find($companyId);
        $totalWorkdays = 0;
        $period        = CarbonPeriod::create($startDate, $endDate);
        foreach ($period as $day) {
            if ($company->isWorkingDay($day)) {
                $totalWorkdays++;
            }
        }

        return [
            'year'           => $year,
            'month'          => $month,
            'month_name'     => $startDate->locale('fr')->isoFormat('MMMM YYYY'),
            'total_workdays' => $totalWorkdays,
            'summary'        => [
                'total'   => $attendances->count(),
                'present' => $attendances->whereIn('status', ['present', 'late'])->count(),
                'late'    => $attendances->where('status', 'late')->count(),
                'absent'  => $attendances->where('status', 'absent')->count(),
                'excused' => $attendances->where('status', 'excused')->count(),
            ],
            'avg_worked_hours' => round($attendances->avg('worked_hours') ?? 0, 2),
            'total_overtime'   => round($attendances->sum('overtime_hours'), 2),
        ];
    }

    /**
     * Fiche de présence individuelle pour un employé sur un mois.
     *
     * @param int $userId  ID de l'utilisateur
     * @param int $year    Année
     * @param int $month   Mois
     * @return array
     */
    public function getEmployeeReport(int $userId, int $year, int $month): array
    {
        $user = User::withoutGlobalScope('company')->find($userId);

        if (!$user) {
            return [];
        }

        $attendances = Attendance::withoutGlobalScope('company')
            ->with(['checkInLocation', 'checkOutLocation'])
            ->where('user_id', $userId)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date')
            ->get();

        return [
            'user'             => [
                'id'         => $user->id,
                'full_name'  => $user->full_name,
                'email'      => $user->email,
                'department' => $user->department?->name,
            ],
            'year'             => $year,
            'month'            => $month,
            'attendances'      => $attendances,
            'summary'          => [
                'present'          => $attendances->whereIn('status', ['present', 'late'])->count(),
                'late'             => $attendances->where('status', 'late')->count(),
                'absent'           => $attendances->where('status', 'absent')->count(),
                'excused'          => $attendances->where('status', 'excused')->count(),
                'total_worked_h'   => round($attendances->sum('worked_hours'), 2),
                'total_overtime_h' => round($attendances->sum('overtime_hours'), 2),
                'total_late_min'   => $attendances->sum('late_minutes'),
            ],
        ];
    }
}
