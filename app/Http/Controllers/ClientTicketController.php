<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientTicketController extends Controller
{
    public function __construct(private TicketService $ticketService) {}

    public function index()
    {
        $user    = auth()->user();
        $tickets = SupportTicket::where('company_id', $user->company_id)
            ->with('user')
            ->withCount('messages')
            ->latest()
            ->paginate(15);

        return Inertia::render('Support/Index', ['tickets' => $tickets]);
    }

    public function create()
    {
        return Inertia::render('Support/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject'  => 'required|string|max:191',
            'category' => 'required|in:bug,billing,feature_request,account,general',
            'priority' => 'required|in:low,medium,high,urgent',
            'body'     => 'required|string|max:5000',
        ]);

        $ticket = $this->ticketService->createTicket(auth()->user(), $validated);

        return redirect()->route('client.tickets.show', $ticket)
            ->with('success', "Ticket {$ticket->ticket_number} créé avec succès.");
    }

    public function show(SupportTicket $ticket)
    {
        abort_unless($ticket->company_id === auth()->user()->company_id, 403);
        $ticket->load(['user', 'messages.user']);
        return Inertia::render('Support/Show', ['ticket' => $ticket]);
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        abort_unless($ticket->company_id === auth()->user()->company_id, 403);
        $validated = $request->validate(['body' => 'required|string|max:5000']);

        $this->ticketService->addMessage($ticket, auth()->user(), $validated['body']);

        return back()->with('success', 'Message envoyé.');
    }
}
