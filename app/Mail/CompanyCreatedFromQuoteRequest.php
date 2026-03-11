<?php

namespace App\Mail;

use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CompanyCreatedFromQuoteRequest extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Company $company,
        public string $temporaryPassword,
        public int $trialDays = 30,
        public bool $subscriptionDirect = false
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre espace PointPro est prêt',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.company-created-from-quote-request',
        );
    }
}
