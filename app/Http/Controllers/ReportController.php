<?php

namespace App\Http\Controllers;

use App\Exports\MonthlyReportExport;
use App\Models\Attendance;
use App\Models\Company;
use App\Models\Department;
use App\Models\User;
use App\Services\ReportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function __construct(private ReportService $reportService) {}

    /**
     * Page principale des rapports.
     */
    public function index(Request $request): \Inertia\Response
    {
        $companyId = auth()->user()->company_id;
        $date      = $request->input('date', today()->toDateString());

        $stats       = $this->reportService->getDashboardStats($companyId, $date);
        $deptStats   = $this->reportService->getDepartmentStats($companyId, $date);
        $departments = Department::select('id', 'name')->get();

        return Inertia::render('Rapports/Index', [
            'stats'       => $stats,
            'deptStats'   => $deptStats,
            'departments' => $departments,
            'date'        => $date,
        ]);
    }

    /**
     * Rapport mensuel détaillé.
     */
    public function monthly(Request $request): \Inertia\Response
    {
        $companyId = auth()->user()->company_id;
        $year      = (int) $request->input('year', date('Y'));
        $month     = (int) $request->input('month', date('n'));

        $report    = $this->reportService->getMonthlyReport($companyId, $year, $month);
        $employees = $this->buildEmployeeStats($companyId, $year, $month, $report['total_workdays']);

        return Inertia::render('Rapports/Mensuel', [
            'report'    => $report,
            'employees' => $employees,
            'year'      => $year,
            'month'     => $month,
        ]);
    }

    /**
     * Export du rapport (csv | pdf | xlsx).
     */
    public function export(Request $request, string $format)
    {
        $companyId = auth()->user()->company_id;
        $year      = (int) $request->input('year', date('Y'));
        $month     = (int) $request->input('month', date('n'));

        $report    = $this->reportService->getMonthlyReport($companyId, $year, $month);
        $employees = $this->buildEmployeeStats($companyId, $year, $month, $report['total_workdays']);
        $company   = Company::find($companyId);
        $filename  = "rapport_{$year}_{$month}";

        return match ($format) {
            'pdf'  => $this->exportPdf($report, $employees, $company, $filename),
            'xlsx' => $this->exportExcel($report, $employees, $company->name, $filename),
            'csv'  => $this->exportCsv($employees, $report, $filename),
            default => back()->with('error', 'Format non supporté.'),
        };
    }

    // ─── Helpers privés ──────────────────────────────────────────────────────

    private function buildEmployeeStats(int $companyId, int $year, int $month, int $totalWorkdays): \Illuminate\Support\Collection
    {
        return User::with([
            'department:id,name',
            'attendances' => fn($q) => $q->whereYear('date', $year)->whereMonth('date', $month),
        ])
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->whereIn('role', ['employee', 'manager'])
            ->orderBy('last_name')
            ->get()
            ->map(fn($u) => [
                'id'              => $u->id,
                'full_name'       => $u->full_name,
                'department'      => $u->department?->name,
                'present_count'   => $u->attendances->whereIn('status', ['present', 'late'])->count(),
                'late_count'      => $u->attendances->where('status', 'late')->count(),
                'absent_count'    => $u->attendances->where('status', 'absent')->count(),
                'total_hours'     => round($u->attendances->sum('worked_hours'), 2),
                'overtime_hours'  => round($u->attendances->sum('overtime_hours'), 2),
                'total_late_min'  => $u->attendances->sum('late_minutes'),
                'attendance_rate' => $totalWorkdays > 0
                    ? round(($u->attendances->whereIn('status', ['present', 'late'])->count() / $totalWorkdays) * 100, 1)
                    : 0,
            ]);
    }

    private function exportPdf(array $report, $employees, Company $company, string $filename)
    {
        $pdf = Pdf::loadView('reports.monthly', compact('report', 'employees', 'company'))
            ->setPaper('a4', 'landscape')
            ->setOption('defaultFont', 'DejaVu Sans')
            ->setOption('isHtml5ParserEnabled', true);

        return $pdf->download("{$filename}.pdf");
    }

    private function exportExcel(array $report, $employees, string $companyName, string $filename)
    {
        return Excel::download(
            new MonthlyReportExport($employees, $report, $companyName),
            "{$filename}.xlsx"
        );
    }

    private function exportCsv($employees, array $report, string $filename)
    {
        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}.csv\"",
        ];

        $callback = function () use ($employees, $report) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($file, [
                'Nom', 'Département', 'Jours présents', 'Jours en retard',
                'Jours absents', 'Total heures', 'Heures sup', 'Minutes retard', 'Taux présence (%)',
            ], ';');

            foreach ($employees as $emp) {
                fputcsv($file, [
                    $emp['full_name'],
                    $emp['department'] ?? '—',
                    $emp['present_count'],
                    $emp['late_count'],
                    $emp['absent_count'],
                    $emp['total_hours'],
                    $emp['overtime_hours'],
                    $emp['total_late_min'],
                    $emp['attendance_rate'],
                ], ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
