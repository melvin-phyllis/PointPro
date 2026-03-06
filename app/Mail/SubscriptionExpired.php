<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionExpired extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Subscription $subscription) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre abonnement PointPro a expiré',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.subscription-expired',
            with: [
                'subscription' => $this->subscription,
                'company'      => $this->subscription->company,
                'plan'         => $this->subscription->plan,
            ],
        );
    }
}
