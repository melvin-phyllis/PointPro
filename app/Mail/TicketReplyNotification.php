<?php

namespace App\Mail;

use App\Models\SupportTicket;
use App\Models\TicketMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketReplyNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public SupportTicket $ticket, public TicketMessage $message) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Réponse à votre ticket #{$this->ticket->ticket_number}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket-reply',
            with: [
                'ticket'  => $this->ticket,
                'message' => $this->message,
                'company' => $this->ticket->company,
            ],
        );
    }
}
