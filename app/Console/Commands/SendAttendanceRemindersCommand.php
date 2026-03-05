<?php

namespace App\Console\Commands;

use App\Models\Attendance;
use App\Models\Company;
use App\Models\User;
use App\Notifications\AttendanceReminderNotification;
use App\Notifications\ManagerAlertNotification;
use Illuminate\Console\Command;

class SendAttendanceRemindersCommand extends Command
{
    protected $signature   = 'app:send-reminders {--dry-run : Afficher sans envoyer}';
    protected $description = 'Envoie les rappels de pointage aux employés absents et alertes aux managers';

    public function handle(): int
    {
        if (!now()->isWeekday()) {
            $this->info('Jour non ouvré — aucun rappel envoyé.');
            return self::SUCCESS;
        }

        $today     = today()->toDateString();
        $companies = Company::where('is_active', true)->get();
        $sent      = 0;

        foreach ($companies as $company) {
            $settings   = $company->settings ?? [];
            $workStart  = $settings['work_start']   ?? '08:00';
            $tolerance  = $settings['late_tolerance'] ?? 15;

            // Récupérer les employés actifs de l'entreprise
            $employees = User::where('company_id', $company->id)
                ->where('is_active', true)
                ->whereIn('role', ['employee', 'manager'])
                ->get();

            // IDs des employés ayant déjà pointé aujourd'hui
            $pointedIds = Attendance::withoutGlobalScope('company')
                ->where('company_id', $company->id)
                ->where('date', $today)
                ->whereNotNull('check_in')
                ->pluck('user_id')
                ->toArray();

            // Employés sans pointage
            $missing = $employees->filter(fn($u) => !in_array($u->id, $pointedIds));

            foreach ($missing as $employee) {
                if ($this->option('dry-run')) {
                    $this->line("  [dry-run] Rappel → {$employee->email}");
                } else {
                    $employee->notify(new AttendanceReminderNotification($workStart));
                }
                $sent++;
            }

            // Alertes manager : employés en retard aujourd'hui
            $lateAttendances = Attendance::withoutGlobalScope('company')
                ->with('user:id,first_name,last_name')
                ->where('company_id', $company->id)
                ->where('date', $today)
                ->where('status', 'late')
                ->where('late_minutes', '>', 0)
                ->get();

            if ($lateAttendances->isNotEmpty()) {
                $lateData = $lateAttendances->map(fn($a) => [
                    'name'    => $a->user?->full_name ?? '—',
                    'minutes' => $a->late_minutes,
                ])->toArray();

                // Notifier les managers/admins de l'entreprise
                $managers = User::where('company_id', $company->id)
                    ->whereIn('role', ['admin', 'manager'])
                    ->where('is_active', true)
                    ->get();

                foreach ($managers as $manager) {
                    if ($this->option('dry-run')) {
                        $this->line("  [dry-run] Alerte retard → {$manager->email} ({$lateAttendances->count()} retards)");
                    } else {
                        $manager->notify(new ManagerAlertNotification('late', $lateData));
                    }
                }
            }
        }

        $this->info("Rappels envoyés : {$sent}");
        return self::SUCCESS;
    }
}
