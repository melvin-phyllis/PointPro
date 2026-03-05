<?php

namespace App\Notifications;

use App\Models\Company;
use App\Services\ReportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;

class MonthlyReportNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private array      $report,
        private Collection $employees,
        private Company    $company
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $monthName  = ucfirst($this->report['month_name']);
        $summary    = $this->report['summary'];
        $rate       = $this->report['total_workdays'] > 0
            ? round(($summary['present'] / ($this->report['total_workdays'] * max(1, $this->employees->count()))) * 100, 1)
            : 0;

        // Générer le PDF en mémoire
        $pdf = Pdf::loadView('reports.monthly', [
            'report'    => $this->report,
            'employees' => $this->employees,
            'company'   => $this->company,
        ])
        ->setPaper('a4', 'landscape')
        ->setOption('defaultFont', 'DejaVu Sans');

        $pdfContent = $pdf->output();
        $filename   = 'rapport_' . $this->report['year'] . '_' . $this->report['month'] . '.pdf';

        return (new MailMessage)
            ->subject("📊 Rapport mensuel {$monthName} — {$this->company->name}")
            ->greeting('Bonjour ' . $notifiable->first_name . ',')
            ->line("Le rapport de présence du mois de **{$monthName}** est disponible.")
            ->line('**Résumé du mois :**')
            ->line("• Jours ouvrés : **{$this->report['total_workdays']}**")
            ->line("• Présences : **{$summary['present']}**")
            ->line("• Retards : **{$summary['late']}**")
            ->line("• Absences : **{$summary['absent']}**")
            ->line("• Heures supplémentaires : **{$this->report['total_overtime']}h**")
            ->action('Voir le rapport en ligne', url('/rapports/mensuel?year=' . $this->report['year'] . '&month=' . $this->report['month']))
            ->attachData($pdfContent, $filename, ['mime' => 'application/pdf'])
            ->salutation('PointPro — Rapports automatiques');
    }
}
