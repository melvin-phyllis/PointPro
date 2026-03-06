<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\User;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function __construct(private TicketService $ticketService) {}

    public function index(Request $request)
    {
        $tickets = SupportTicket::with(['company', 'user', 'assignedTo'])
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->priority, fn($q, $p) => $q->where('priority', $p))
            ->when($request->search, fn($q, $s) =>
                $q->where('subject', 'like', "%{$s}%")
                  ->orWhere('ticket_number', 'like', "%{$s}%")
            )
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Support/Index', [
            'tickets' => $tickets,
            'stats'   => $this->ticketService->getStats(),
            'filters' => $request->only(['status', 'priority', 'search']),
        ]);
    }

    public function show(SupportTicket $ticket)
    {
        $ticket->load(['company', 'user', 'assignedTo', 'messages.user']);
        return Inertia::render('Admin/Support/Show', ['ticket' => $ticket]);
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'body'             => 'required|string|max:5000',
            'is_internal_note' => 'boolean',
        ]);

        $this->ticketService->addMessage(
            $ticket,
            auth()->user(),
            $validated['body'],
            $validated['is_internal_note'] ?? false
        );

        return back()->with('success', 'Réponse envoyée.');
    }

    public function close(SupportTicket $ticket)
    {
        $ticket->close();
        return back()->with('success', 'Ticket fermé.');
    }

    public function assign(Request $request, SupportTicket $ticket)
    {
        $request->validate(['assigned_to' => 'nullable|exists:users,id']);
        $ticket->update(['assigned_to' => $request->assigned_to]);
        return back()->with('success', 'Ticket assigné.');
    }
}
