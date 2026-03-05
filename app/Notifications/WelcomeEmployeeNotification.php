<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeEmployeeNotification extends Notification
{

    public function __construct(
        private string $plainPassword,
        private string $companyName,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('🎉 Bienvenue sur PointPro — ' . $this->companyName)
            ->greeting('Bonjour ' . $notifiable->first_name . ',')
            ->line('Votre compte PointPro a été créé par votre administrateur.')
            ->line('Voici vos identifiants de connexion :')
            ->line('**Email :** ' . $notifiable->email)
            ->line('**Mot de passe :** ' . $this->plainPassword)
            ->action('Se connecter à PointPro', url('/login'))
            ->line('Pour votre sécurité, changez votre mot de passe dès votre première connexion.')
            ->salutation('L\'équipe ' . $this->companyName);
    }
}
