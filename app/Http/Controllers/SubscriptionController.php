<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $company      = auth()->user()->company;
        $subscription = $company?->currentSubscription()->with('plan')->first();
        $plans        = Plan::active()->ordered()->get();
        $payments     = Payment::where('company_id', $company?->id)
            ->with('subscription.plan')
            ->latest()
            ->limit(10)
            ->get();
        $invoices = Invoice::where('company_id', $company?->id)
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Subscription/Index', [
            'subscription' => $subscription,
            'plans'        => $plans,
            'payments'     => $payments,
            'invoices'     => $invoices,
        ]);
    }

    public function success()
    {
        return redirect()->route('subscription.index')
            ->with('success', 'Paiement confirmé ! Votre abonnement a été activé.');
    }

    public function cancel()
    {
        return redirect()->route('subscription.index')
            ->with('error', 'Paiement annulé.');
    }
}
