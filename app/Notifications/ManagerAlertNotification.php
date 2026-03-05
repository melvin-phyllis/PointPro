<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ManagerAlertNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @param string $type     'late' | 'absent'
     * @param array  $employees Liste des employés concernés [['name'=>..., 'minutes'=>...], ...]
     */
    public function __construct(
        private string $type,
        private array  $employees
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $date  = now()->locale('fr')->isoFormat('dddd D MMMM YYYY');
        $count = count($this->employees);

        if ($this->type === 'late') {
            $subject = "⚠️ {$count} employé(s) en retard — {$date}";
            $intro   = "{$count} membre(s) de votre équipe sont arrivés en retard aujourd'hui :";
        } else {
            $subject = "🚨 {$count} employé(s) absent(s) — {$date}";
            $intro   = "{$count} membre(s) de votre équipe sont absents aujourd'hui :";
        }

        $lines = array_map(function ($emp) {
            if ($this->type === 'late' && isset($emp['minutes'])) {
                return '• **' . $emp['name'] . '** — ' . $emp['minutes'] . ' min de retard';
            }
            return '• **' . $emp['name'] . '**';
        }, $this->employees);

        $message = (new MailMessage)
            ->subject($subject)
            ->greeting('Bonjour ' . $notifiable->first_name . ',')
            ->line($intro);

        foreach ($lines as $line) {
            $message->line($line);
        }

        return $message
            ->action('Voir le tableau de bord', url('/dashboard'))
            ->salutation('PointPro — Alertes automatiques');
    }
}
