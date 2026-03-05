<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LoginNotification extends Notification
{
    public function __construct(
        private string $ipAddress,
        private string $userAgent,
        private string $loginAt,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        // Simplify the browser/device label
        $device = $this->parseUserAgent($this->userAgent);

        return (new MailMessage)
            ->subject('🔐 Nouvelle connexion à votre compte PointPro')
            ->greeting('Bonjour ' . $notifiable->first_name . ',')
            ->line('Une connexion a été détectée sur votre compte PointPro.')
            ->line('**Date :** ' . $this->loginAt)
            ->line('**Adresse IP :** ' . $this->ipAddress)
            ->line('**Appareil :** ' . $device)
            ->line('Si vous êtes à l\'origine de cette connexion, vous n\'avez rien à faire.')
            ->action('Accéder à mon compte', url('/dashboard'))
            ->line('Si vous n\'avez pas effectué cette connexion, changez immédiatement votre mot de passe et contactez votre administrateur.')
            ->salutation('L\'équipe PointPro');
    }

    private function parseUserAgent(string $ua): string
    {
        if (str_contains($ua, 'iPhone') || str_contains($ua, 'iPad')) {
            return 'Apple iOS';
        }
        if (str_contains($ua, 'Android')) {
            return 'Android';
        }
        if (str_contains($ua, 'Windows')) {
            $browser = str_contains($ua, 'Edg') ? 'Edge' :
                      (str_contains($ua, 'Chrome') ? 'Chrome' :
                      (str_contains($ua, 'Firefox') ? 'Firefox' : 'Navigateur'));
            return $browser . ' / Windows';
        }
        if (str_contains($ua, 'Macintosh')) {
            $browser = str_contains($ua, 'Edg') ? 'Edge' :
                      (str_contains($ua, 'Chrome') ? 'Chrome' :
                      (str_contains($ua, 'Safari') ? 'Safari' : 'Navigateur'));
            return $browser . ' / Mac';
        }
        return 'Navigateur inconnu';
    }
}
