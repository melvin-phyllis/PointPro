<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AttendanceReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private string $workStart = '08:00') {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $loginUrl = url('/pointage');

        return (new MailMessage)
            ->subject('⏰ Rappel de pointage — ' . now()->locale('fr')->isoFormat('dddd D MMMM'))
            ->greeting('Bonjour ' . $notifiable->first_name . ',')
            ->line('Vous n\'avez pas encore pointé votre arrivée aujourd\'hui.')
            ->line('Heure de prise de service : **' . $this->workStart . '**')
            ->action('Pointer mon arrivée', $loginUrl)
            ->line('Si vous avez déjà pointé via l\'application, ignorez ce message.')
            ->salutation('L\'équipe PointPro');
    }
}
