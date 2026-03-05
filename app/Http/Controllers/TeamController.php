<?php

namespace App\Http\Controllers;

use App\Exports\AttendancePeriodExport;
use App\Models\Attendance;
use App\Models\Company;
use App\Models\Department;
use App\Models\User;
use App\Services\ReportService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class TeamController extends Controller
{
    public function __construct(private ReportService $reportService) {}

    /**
     * Liste des pointages de l'équipe (avec filtres).
     */
    public function index(Request $request): Response
    {
        $date  = $request->input('date', today()->toDateString());
        $query = Attendance::with(['user:id,first_name,last_name,department_id,role,avatar_path', 'user.department:id,name', 'checkInLocation:id,name'])
            ->forDate($date);

        // Filtre manager : uniquement son département
        if (auth()->user()->isManager()) {
            $deptId = Department::where('manager_id', auth()->id())->value('id');
            if ($deptId) {
                $query->whereHas('user', fn($q) => $q->where('department_id', $deptId));
            }
        }

        if ($deptId = $request->input('department_id')) {
            $query->whereHas('user', fn($q) => $q->where('department_id', $deptId));
        }

        $attendances = $query->get()->map(fn($a) => [
            'id'            => $a->id,
            'user'          => [
                'id'         => $a->user->id,
                'full_name'  => $a->user->full_name,
                'department' => $a->user->department?->name,
                'role'       => $a->user->role,
                'avatar'     => $a->user->avatar_path,
            ],
            'check_in'      => $a->check_in?->format('H:i'),
            'check_out'     => $a->check_out?->format('H:i'),
            'status'        => $a->status,
            'late_minutes'  => $a->late_minutes,
            'worked_hours'  => $a->worked_duration,
            'location_name' => $a->checkInLocation?->name,
        ]);

        $departments = Department::select('id', 'name')->get();
        $stats       = $this->reportService->getDashboardStats(auth()->user()->company_id, $date);

        return Inertia::render('Equipe/Index', [
            'attendances' => $attendances,
            'departments' => $departments,
            'stats'       => $stats,
            'date'        => $date,
            'filters'     => $request->only(['date', 'department_id']),
        ]);
    }

    /**
     * Export CSV des pointages d'une journée.
     */
    public function exportCsv(Request $request)
    {
        $date  = $request->input('date', today()->toDateString());
        $query = Attendance::with(['user:id,first_name,last_name,department_id,role', 'user.department:id,name', 'checkInLocation:id,name'])
            ->forDate($date);

        if (auth()->user()->isManager()) {
            $deptId = Department::where('manager_id', auth()->id())->value('id');
            if ($deptId) {
                $query->whereHas('user', fn($q) => $q->where('department_id', $deptId));
            }
        }

        if ($deptId = $request->input('department_id')) {
            $query->whereHas('user', fn($q) => $q->where('department_id', $deptId));
        }

        $attendances = $query->get();
        $filename    = "presences_{$date}.csv";

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($attendances, $date) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF)); // BOM UTF-8

            fputcsv($file, ['Date', 'Employé', 'Département', 'Arrivée', 'Départ', 'Durée', 'Lieu', 'Statut', 'Retard (min)'], ';');

            foreach ($attendances as $a) {
                fputcsv($file, [
                    $date,
                    $a->user->full_name,
                    $a->user->department?->name ?? '—',
                    $a->check_in?->format('H:i') ?? '—',
                    $a->check_out?->format('H:i') ?? '—',
                    $a->worked_duration ?? '—',
                    $a->checkInLocation?->name ?? '—',
                    $a->status,
                    $a->late_minutes,
                ], ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export par période (CSV ou XLSX) — de date_from à date_to.
     */
    public function exportPeriod(Request $request)
    {
        $request->validate([
            'date_from'     => 'required|date',
            'date_to'       => 'required|date|after_or_equal:date_from',
            'format'        => 'required|in:csv,xlsx',
            'department_id' => 'nullable|integer',
        ]);

        $dateFrom    = Carbon::parse($request->input('date_from'))->startOfDay();
        $dateTo      = Carbon::parse($request->input('date_to'))->endOfDay();
        $format      = $request->input('format');
        $companyId   = auth()->user()->company_id;

        $query = Attendance::with([
            'user:id,first_name,last_name,department_id',
            'user.department:id,name',
            'checkInLocation:id,name',
        ])
            ->where('company_id', $companyId)
            ->whereBetween('date', [$dateFrom->toDateString(), $dateTo->toDateString()])
            ->orderBy('date')
            ->orderBy('user_id');

        if (auth()->user()->isManager()) {
            $deptId = Department::where('manager_id', auth()->id())->value('id');
            if ($deptId) {
                $query->whereHas('user', fn($q) => $q->where('department_id', $deptId));
            }
        }

        if ($deptId = $request->input('department_id')) {
            $query->whereHas('user', fn($q) => $q->where('department_id', $deptId));
        }

        $attendances = $query->get();
        $companyName = Company::find($companyId)?->name ?? 'PointPro';

        $rows = $attendances->map(fn($a) => [
            'date'         => $a->date,
            'employee'     => $a->user->full_name,
            'department'   => $a->user->department?->name ?? '—',
            'check_in'     => $a->check_in?->format('H:i') ?? '—',
            'check_out'    => $a->check_out?->format('H:i') ?? '—',
            'worked_hours' => $a->worked_duration ?? '—',
            'location'     => $a->checkInLocation?->name ?? '—',
            'status'       => $a->status,
            'late_minutes' => $a->late_minutes,
        ]);

        $from     = $dateFrom->format('Y-m-d');
        $to       = $dateTo->format('Y-m-d');
        $filename = "presences_{$from}_{$to}";

        if ($format === 'xlsx') {
            return Excel::download(
                new AttendancePeriodExport(collect($rows), $companyName, $from, $to),
                "{$filename}.xlsx"
            );
        }

        // CSV
        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}.csv\"",
        ];

        $callback = function () use ($rows, $companyName, $from, $to) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($file, [$companyName . ' — Historique des présences'], ';');
            fputcsv($file, ['Du ' . $from . ' au ' . $to], ';');
            fputcsv($file, [], ';');
            fputcsv($file, ['Date', 'Employé', 'Département', 'Arrivée', 'Départ', 'Durée', 'Lieu', 'Statut', 'Retard (min)'], ';');

            foreach ($rows as $r) {
                fputcsv($file, [
                    $r['date'], $r['employee'], $r['department'],
                    $r['check_in'], $r['check_out'], $r['worked_hours'],
                    $r['location'], $r['status'], $r['late_minutes'],
                ], ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Vue temps réel du jour (employés présents, absents, en retard).
     */
    public function today(): Response
    {
        $companyId = auth()->user()->company_id;
        $today     = today()->toDateString();

        // Récupérer tous les employés actifs avec leur pointage du jour
        $employees = User::with([
            'department:id,name',
            'attendances' => fn($q) => $q->where('date', $today)->with('checkInLocation:id,name'),
        ])
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->whereIn('role', ['employee', 'manager'])
            ->orderBy('last_name')
            ->get()
            ->map(fn($u) => [
                'id'         => $u->id,
                'full_name'  => $u->full_name,
                'department' => $u->department?->name,
                'role'       => $u->role,
                'avatar'     => $u->avatar_path,
                'attendance' => $u->attendances->first() ? [
                    'check_in'      => $u->attendances->first()->check_in?->format('H:i'),
                    'check_out'     => $u->attendances->first()->check_out?->format('H:i'),
                    'status'        => $u->attendances->first()->status,
                    'late_minutes'  => $u->attendances->first()->late_minutes,
                    'location_name' => $u->attendances->first()->checkInLocation?->name,
                ] : null,
            ]);

        $stats = $this->reportService->getDashboardStats($companyId, $today);

        return Inertia::render('Equipe/AujourdhUI', [
            'employees' => $employees,
            'stats'     => $stats,
        ]);
    }
}
