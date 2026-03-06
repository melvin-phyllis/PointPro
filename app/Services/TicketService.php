<?php

namespace App\Services;

use App\Models\SupportTicket;
use App\Models\TicketMessage;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class TicketService
{
    public function createTicket(User $user, array $data): SupportTicket
    {
        $ticket = SupportTicket::create([
            'company_id'    => $user->company_id,
            'user_id'       => $user->id,
            'ticket_number' => SupportTicket::generateTicketNumber(),
            'subject'       => $data['subject'],
            'category'      => $data['category'] ?? 'general',
            'priority'      => $data['priority'] ?? 'medium',
            'status'        => 'open',
        ]);

        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id'   => $user->id,
            'body'      => $data['body'],
        ]);

        Log::info("Ticket créé #{$ticket->ticket_number}");

        return $ticket;
    }

    public function addMessage(SupportTicket $ticket, User $user, string $body, bool $isInternal = false): TicketMessage
    {
        $message = TicketMessage::create([
            'ticket_id'        => $ticket->id,
            'user_id'          => $user->id,
            'body'             => $body,
            'is_internal_note' => $isInternal,
        ]);

        // Changer le statut selon qui répond
        if ($user->isSuperAdmin()) {
            if ($ticket->status === 'open') {
                $ticket->update(['status' => 'in_progress']);
            }
        } else {
            if ($ticket->status === 'waiting_customer') {
                $ticket->update(['status' => 'open']);
            }
        }

        return $message;
    }

    public function getStats(): array
    {
        return [
            'open_count'        => SupportTicket::where('status', 'open')->count(),
            'in_progress_count' => SupportTicket::where('status', 'in_progress')->count(),
            'resolved_today'    => SupportTicket::where('status', 'resolved')
                ->whereDate('resolved_at', today())
                ->count(),
            'urgent_open'       => SupportTicket::where('priority', 'urgent')
                ->whereNotIn('status', ['resolved', 'closed'])
                ->count(),
        ];
    }
}
