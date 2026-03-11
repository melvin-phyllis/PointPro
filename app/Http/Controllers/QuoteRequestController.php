<?php

namespace App\Http\Controllers;

use App\Mail\QuoteRequestConfirmationToContact;
use App\Mail\QuoteRequestNotification;
use App\Models\QuoteRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class QuoteRequestController extends Controller
{
    /**
     * Affiche le formulaire de demande de devis.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/QuoteRequest');
    }

    /**
     * Enregistre la demande de devis et redirige vers la page de confirmation.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'plan'         => ['required', 'in:starter,business,enterprise'],
            'first_name'   => ['required', 'string', 'max:100'],
            'last_name'    => ['required', 'string', 'max:100'],
            'email'        => ['required', 'string', 'lowercase', 'email', 'max:255'],
            'phone'        => ['nullable', 'string', 'max:30'],
            'message'      => ['nullable', 'string', 'max:1000'],
        ]);

        $quoteRequest = QuoteRequest::create($validated);

        // Email automatique au contact : confirmation de réception
        Mail::to($quoteRequest->email)->send(new QuoteRequestConfirmationToContact($quoteRequest));

        // Notification aux admins (conseillers)
        $to = config('services.quote_request_notify_email', [config('mail.from.address')]);
        if (! empty($to)) {
            Mail::to($to)->send(new QuoteRequestNotification($quoteRequest));
        }

        return redirect()->route('quote.request.thank-you');
    }

    /**
     * Page de confirmation après envoi de la demande.
     */
    public function thankYou(): Response
    {
        return Inertia::render('Auth/QuoteRequestThankYou');
    }
}
