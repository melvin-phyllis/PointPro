<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FinalizeAccountController extends Controller
{
    public function create(Request $request): RedirectResponse|Response
    {
        $user = $request->user();
        if ($user->isSuperAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        $company = $user->company;
        if (! $company || ! $company->isTrialExpired()) {
            return redirect()->route('dashboard');
        }

        $plans = Plan::active()->ordered()->get()->map(fn ($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'slug' => $p->slug,
            'price' => $p->price,
            'formatted_price' => $p->formattedPrice(),
            'max_employees' => $p->max_employees,
            'billing_cycle' => $p->billing_cycle,
        ]);

        return Inertia::render('FinalizeAccount', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'email' => $company->email,
                'phone' => $company->phone,
                'address' => $company->address,
                'plan' => $company->plan,
            ],
            'plans' => $plans,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $company = $request->user()->company;
        if (! $company || ! $company->isTrialExpired()) {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:500'],
            'plan' => ['required', 'string', 'in:starter,business,enterprise,custom'],
        ]);

        $company->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'plan' => $validated['plan'],
        ]);

        return redirect()->route('subscription.index')
            ->with('success', 'Informations enregistrées. Choisissez votre offre et finalisez le paiement pour activer votre accès.');
    }
}
