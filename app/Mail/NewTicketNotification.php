<?php

namespace App\Mail;

use App\Models\SupportTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewTicketNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public SupportTicket $ticket) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Nouveau ticket de support #{$this->ticket->ticket_number}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new-ticket',
            with: [
                'ticket'  => $this->ticket,
                'company' => $this->ticket->company,
                'user'    => $this->ticket->user,
            ],
        );
    }
}
