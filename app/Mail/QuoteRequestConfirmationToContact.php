<?php

namespace App\Mail;

use App\Models\QuoteRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Email envoyé automatiquement au contact après soumission du formulaire de demande de devis.
 */
class QuoteRequestConfirmationToContact extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public QuoteRequest $quoteRequest) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'PointPro — Votre demande de devis a bien été reçue',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.quote-request-confirmation-to-contact',
        );
    }
}
