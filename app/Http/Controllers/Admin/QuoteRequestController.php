<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\CompanyCreatedFromQuoteRequest;
use App\Models\Company;
use App\Models\Plan;
use App\Models\QuoteRequest;
use App\Models\User;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class QuoteRequestController extends Controller
{
    public function __construct(private PaymentService $paymentService) {}

    /**
     * Liste des demandes de devis (Super Admin).
     */
    public function index(Request $request): Response
    {
        $requests = QuoteRequest::query()
            ->with('company:id,name')
            ->when($request->search, fn ($q, $v) => $q->where('company_name', 'like', "%{$v}%")
                ->orWhere('email', 'like', "%{$v}%")
                ->orWhere('first_name', 'like', "%{$v}%")
                ->orWhere('last_name', 'like', "%{$v}%"))
            ->when($request->plan, fn ($q, $v) => $q->where('plan', $v))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/QuoteRequests/Index', [
            'quoteRequests' => $requests,
            'filters'       => $request->only(['search', 'plan']),
        ]);
    }

    /**
     * Détail d'une demande de devis.
     */
    public function show(QuoteRequest $quoteRequest): Response
    {
        $quoteRequest->load('company:id,name');
        $plans = Plan::active()->ordered()->get();

        return Inertia::render('Admin/QuoteRequests/Show', [
            'quoteRequest' => $quoteRequest,
            'plans'        => $plans,
        ]);
    }

    /**
     * Créer l'entreprise en démo (trial 30 j à 2 mois) à partir de la demande de devis.
     */
    public function createCompany(Request $request, QuoteRequest $quoteRequest): RedirectResponse
    {
        if ($quoteRequest->company_id) {
            return redirect()->route('admin.companies.show', $quoteRequest->company_id)
                ->with('info', 'Cette demande a déjà été convertie en entreprise.');
        }

        if (User::where('email', $quoteRequest->email)->exists()) {
            return redirect()->back()->with('error', 'Un compte existe déjà avec l\'email ' . $quoteRequest->email . '. Créez l\'entreprise manuellement depuis Entreprises.');
        }

        $validated = $request->validate([
            'trial_days' => ['required', 'integer', 'min:30', 'max:60'],
        ]);
        $trialDays = (int) $validated['trial_days'];

        $password = Str::password(12);
        $company = null;

        DB::transaction(function () use ($quoteRequest, $password, $trialDays, &$company) {
            $slug = Str::slug($quoteRequest->company_name);
            $base = $slug;
            $i = 1;
            while (Company::where('slug', $slug)->exists()) {
                $slug = $base . '-' . $i++;
            }

            $company = Company::create([
                'name'          => $quoteRequest->company_name,
                'slug'          => $slug,
                'email'         => $quoteRequest->email,
                'phone'         => $quoteRequest->phone,
                'plan'          => $quoteRequest->plan,
                'is_active'     => true,
                'settings'      => Company::$defaultSettings,
                'trial_ends_at' => now()->addDays($trialDays),
            ]);

            User::create([
                'company_id'        => $company->id,
                'first_name'        => $quoteRequest->first_name,
                'last_name'         => $quoteRequest->last_name,
                'email'             => $quoteRequest->email,
                'email_verified_at' => now(),
                'password'          => Hash::make($password),
                'role'              => 'admin',
                'is_active'         => true,
            ]);

            Mail::to($quoteRequest->email)->send(new CompanyCreatedFromQuoteRequest($company, $password, $trialDays));

            $quoteRequest->update(['company_id' => $company->id]);
        });

        return redirect()->route('admin.companies.show', $company->id)
            ->with('success', "Entreprise créée en démo ({$trialDays} jours). Un email avec le mot de passe temporaire a été envoyé au contact.");
    }

    /**
     * Créer l'entreprise et attribuer directement un abonnement (sans démo).
     */
    public function createCompanyWithSubscription(Request $request, QuoteRequest $quoteRequest): RedirectResponse
    {
        if ($quoteRequest->company_id) {
            return redirect()->route('admin.companies.show', $quoteRequest->company_id)
                ->with('info', 'Cette demande a déjà été convertie en entreprise.');
        }

        if (User::where('email', $quoteRequest->email)->exists()) {
            return redirect()->back()->with('error', 'Un compte existe déjà avec l\'email ' . $quoteRequest->email . '. Créez l\'entreprise manuellement depuis Entreprises.');
        }

        $validated = $request->validate([
            'plan_id'        => ['required', 'exists:plans,id'],
            'duration'       => ['required', 'in:1_month,3_months,1_year'],
            'amount'         => ['required', 'integer', 'min:1'],
            'payment_method' => ['required', 'in:mobile_money,bank_transfer,cash,wave,other'],
            'notes'          => ['nullable', 'string', 'max:500'],
        ]);

        $plan = Plan::findOrFail($validated['plan_id']);
        $password = Str::password(12);
        $company = null;

        DB::transaction(function () use ($quoteRequest, $plan, $validated, $password, &$company) {
            $slug = Str::slug($quoteRequest->company_name);
            $base = $slug;
            $i = 1;
            while (Company::where('slug', $slug)->exists()) {
                $slug = $base . '-' . $i++;
            }

            $company = Company::create([
                'name'      => $quoteRequest->company_name,
                'slug'      => $slug,
                'email'     => $quoteRequest->email,
                'phone'     => $quoteRequest->phone,
                'plan'      => $quoteRequest->plan,
                'is_active' => true,
                'settings'  => Company::$defaultSettings,
            ]);

            User::create([
                'company_id'        => $company->id,
                'first_name'        => $quoteRequest->first_name,
                'last_name'         => $quoteRequest->last_name,
                'email'             => $quoteRequest->email,
                'email_verified_at' => now(),
                'password'          => Hash::make($password),
                'role'              => 'admin',
                'is_active'         => true,
            ]);

            $this->paymentService->createManualPayment(
                $company,
                $plan,
                (int) $validated['amount'],
                $validated['payment_method'],
                [],
                $validated['notes'] ?? null,
                $validated['duration']
            );

            $quoteRequest->update(['company_id' => $company->id]);

            Mail::to($quoteRequest->email)->send(new CompanyCreatedFromQuoteRequest($company, $password, 0, true));
        });

        return redirect()->route('admin.companies.show', $company->id)
            ->with('success', 'Entreprise créée avec abonnement actif. Un email avec le mot de passe temporaire a été envoyé au contact.');
    }
}
