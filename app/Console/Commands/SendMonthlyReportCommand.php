<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Models\User;
use App\Notifications\MonthlyReportNotification;
use App\Services\ReportService;
use Illuminate\Console\Command;

class SendMonthlyReportCommand extends Command
{
    protected $signature   = 'app:send-monthly-report {--year= : Année (défaut: mois précédent)} {--month= : Mois} {--dry-run : Afficher sans envoyer}';
    protected $description = 'Envoie le rapport mensuel par email aux admins de chaque entreprise';

    public function __construct(private ReportService $reportService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $now   = now()->subMonth(); // Mois précédent par défaut
        $year  = (int) ($this->option('year')  ?? $now->year);
        $month = (int) ($this->option('month') ?? $now->month);

        $this->info("Envoi du rapport {$year}/{$month}...");

        $companies = Company::where('is_active', true)->get();

        foreach ($companies as $company) {
            $report = $this->reportService->getMonthlyReport($company->id, $year, $month);

            $employees = User::with([
                'department:id,name',
                'attendances' => fn($q) => $q->whereYear('date', $year)->whereMonth('date', $month),
            ])
                ->where('company_id', $company->id)
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
                    'attendance_rate' => $report['total_workdays'] > 0
                        ? round(($u->attendances->whereIn('status', ['present', 'late'])->count() / $report['total_workdays']) * 100, 1)
                        : 0,
                ]);

            // Notifier les admins de l'entreprise
            $admins = User::where('company_id', $company->id)
                ->where('role', 'admin')
                ->where('is_active', true)
                ->get();

            foreach ($admins as $admin) {
                if ($this->option('dry-run')) {
                    $this->line("  [dry-run] Rapport → {$admin->email} ({$company->name})");
                } else {
                    $admin->notify(new MonthlyReportNotification($report, $employees, $company));
                }
            }

            $this->line("  ✓ {$company->name} — {$admins->count()} admin(s) notifié(s)");
        }

        $this->info('Terminé.');
        return self::SUCCESS;
    }
}
