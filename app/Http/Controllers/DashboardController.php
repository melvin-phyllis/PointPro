<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Location;
use App\Services\ReportService;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private ReportService $reportService) {}

    /**
     * Afficher le tableau de bord principal.
     * - admin / manager → vue globale de l'entreprise
     * - employee        → vue personnelle (ses propres pointages uniquement)
     */
    public function index(): Response
    {
        $user = auth()->user();

        if ($user->role === 'employee') {
            return $this->employeeDashboard($user);
        }

        return $this->adminDashboard($user);
    }

    // ─── Vue admin / manager ──────────────────────────────────

    private function adminDashboard($user): Response
    {
        $companyId = $user->company_id;

        $stats     = $this->reportService->getDashboardStats($companyId);
        $weekStats = $this->reportService->getWeeklyStats($companyId);
        $deptStats = $this->reportService->getDepartmentStats($companyId);

        $recentAttendances = Attendance::with(['user:id,first_name,last_name,avatar_path', 'checkInLocation:id,name'])
            ->forDate(today())
            ->whereNotNull('check_in')
            ->latest('check_in')
            ->limit(10)
            ->get()
            ->map(fn($a) => [
                'id'            => $a->id,
                'user'          => $a->user,
                'check_in'      => $a->check_in?->format('H:i'),
                'check_out'     => $a->check_out?->format('H:i'),
                'status'        => $a->status,
                'late_minutes'  => $a->late_minutes,
                'location_name' => $a->checkInLocation?->name,
            ]);

        $gpsPoints = Attendance::with('user:id,first_name,last_name')
            ->forDate(today())
            ->whereNotNull('check_in_latitude')
            ->whereNotNull('check_in_longitude')
            ->get()
            ->map(fn($a) => [
                'id'       => $a->id,
                'name'     => $a->user?->full_name ?? '—',
                'lat'      => (float) $a->check_in_latitude,
                'lng'      => (float) $a->check_in_longitude,
                'status'   => $a->status,
                'check_in' => $a->check_in?->format('H:i'),
                'geo_ok'   => $a->is_geo_verified,
            ]);

        $zones = Location::where('is_active', true)
            ->select('id', 'name', 'latitude', 'longitude', 'radius_meters')
            ->get()
            ->map(fn($l) => [
                'id'     => $l->id,
                'name'   => $l->name,
                'lat'    => (float) $l->latitude,
                'lng'    => (float) $l->longitude,
                'radius' => $l->radius_meters,
            ]);

        return Inertia::render('Dashboard', [
            'role'              => 'admin',
            'stats'             => $stats,
            'weeklyStats'       => $weekStats,
            'deptStats'         => $deptStats,
            'recentAttendances' => $recentAttendances,
            'gpsPoints'         => $gpsPoints,
            'zones'             => $zones,
        ]);
    }

    // ─── Vue employé : données personnelles uniquement ────────

    private function employeeDashboard($user): Response
    {
        $today = today()->toDateString();

        // Pointage d'aujourd'hui
        $todayRecord = Attendance::withoutGlobalScope('company')
            ->with('checkInLocation:id,name')
            ->where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        $todayAttendance = $todayRecord ? [
            'status'        => $todayRecord->status,
            'check_in'      => $todayRecord->check_in?->format('H:i'),
            'check_out'     => $todayRecord->check_out?->format('H:i'),
            'late_minutes'  => $todayRecord->late_minutes,
            'worked_hours'  => $todayRecord->worked_duration,
            'location_name' => $todayRecord->checkInLocation?->name,
        ] : null;

        // Résumé du mois en cours
        $startOfMonth = today()->startOfMonth()->toDateString();
        $endOfMonth   = today()->endOfMonth()->toDateString();

        $monthRecords = Attendance::withoutGlobalScope('company')
            ->where('user_id', $user->id)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get();

        $monthSummary = [
            'present'        => $monthRecords->whereIn('status', ['present', 'late'])->count(),
            'late'           => $monthRecords->where('status', 'late')->count(),
            'absent'         => $monthRecords->where('status', 'absent')->count(),
            'total_worked_h' => round($monthRecords->sum('worked_hours'), 1),
            'month_label'    => Carbon::today()->locale('fr')->isoFormat('MMMM YYYY'),
        ];

        // Les 7 derniers jours (statut rapide)
        $last7Records = Attendance::withoutGlobalScope('company')
            ->where('user_id', $user->id)
            ->whereBetween('date', [today()->subDays(6)->toDateString(), $today])
            ->get()
            ->keyBy('date');

        $weekDays = [];
        for ($i = 6; $i >= 0; $i--) {
            $day     = today()->subDays($i);
            $dateStr = $day->toDateString();
            $record  = $last7Records->get($dateStr);
            $weekDays[] = [
                'date'       => $dateStr,
                'day'        => $day->locale('fr')->isoFormat('ddd D/M'),
                'is_weekend' => $day->isWeekend(),
                'status'     => $record?->status,
            ];
        }

        return Inertia::render('Dashboard', [
            'role'            => 'employee',
            'todayAttendance' => $todayAttendance,
            'monthSummary'    => $monthSummary,
            'weekDays'        => $weekDays,
        ]);
    }
}
