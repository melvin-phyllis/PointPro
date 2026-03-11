<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\SupportTicket;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminCompanyController extends Controller
{
    public function __construct(private PaymentService $paymentService) {}

    public function index(Request $request): Response
    {
        $companies = Company::query()
            ->when($request->boolean('with_deleted'), fn($q) => $q->withTrashed())
            ->withCount('users')
            ->with('currentSubscription.plan')
            ->when($request->search, fn($q, $s) =>
                $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")
            )
            ->when($request->plan, fn($q, $p) => $q->where('plan', $p))
            ->when($request->status, function ($q, $status) {
                if ($status === 'active')   $q->where('is_active', true);
                if ($status === 'inactive') $q->where('is_active', false);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Companies/Index', [
            'companies' => $companies,
            'filters'   => $request->only(['search', 'plan', 'status', 'with_deleted']),
        ]);
    }

    public function show(Company $company): Response
    {
        $company->load(['users.department', 'departments', 'locations', 'currentSubscription.plan']);
        $company->loadCount(['users', 'attendances', 'locations', 'departments']);

        $payments = Payment::where('company_id', $company->id)
            ->with('subscription.plan')
            ->latest()
            ->limit(10)
            ->get();

        $tickets = SupportTicket::where('company_id', $company->id)
            ->latest()
            ->limit(5)
            ->get();

        $plans = Plan::active()->ordered()->get();

        return Inertia::render('Admin/Companies/Show', [
            'company'  => $company,
            'payments' => $payments,
            'tickets'  => $tickets,
            'plans'    => $plans,
        ]);
    }

    /**
     * Attribuer un abonnement à l'entreprise (paiement enregistré hors app).
     */
    public function storeSubscription(Request $request, Company $company): RedirectResponse
    {
        $validated = $request->validate([
            'plan_id'        => 'required|exists:plans,id',
            'duration'       => 'required|in:1_month,3_months,1_year',
            'amount'         => 'required|integer|min:1',
            'payment_method' => 'required|in:mobile_money,bank_transfer,cash,wave,other',
            'notes'          => 'nullable|string|max:500',
        ]);

        $plan = Plan::findOrFail($validated['plan_id']);

        $payment = $this->paymentService->createManualPayment(
            $company,
            $plan,
            (int) $validated['amount'],
            $validated['payment_method'],
            [],
            $validated['notes'] ?? null,
            $validated['duration']
        );

        return redirect()->route('admin.companies.show', $company)
            ->with('success', "Abonnement enregistré. Paiement de {$payment->formattedAmount()}.");
    }

    public function create(): Response
    {
        $plans = Plan::active()->ordered()->get();
        return Inertia::render('Admin/Companies/Create', ['plans' => $plans]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:191',
            'email'   => 'required|email|max:191|unique:companies',
            'phone'   => 'nullable|string|max:30',
            'address' => 'nullable|string|max:191',
            'plan'    => 'required|in:starter,business,enterprise,custom',
        ]);

        $validated['slug']      = \Str::slug($validated['name']);
        $validated['is_active'] = true;

        $company = Company::create($validated);

        return redirect()->route('admin.companies.show', $company)
            ->with('success', "Entreprise {$company->name} créée avec succès.");
    }

    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'name'                 => 'sometimes|string|max:191',
            'email'                => 'sometimes|email|max:191|unique:companies,email,' . $company->id,
            'phone'                => 'nullable|string|max:30',
            'address'              => 'nullable|string|max:191',
            'plan'                 => 'sometimes|in:starter,business,enterprise,custom',
            'is_active'            => 'sometimes|boolean',
            'subscription_ends_at' => 'sometimes|nullable|date',
        ]);

        if (!empty($validated['name'])) {
            $validated['slug'] = \Str::slug($validated['name']);
        }
        $company->update($validated);
        return back()->with('success', 'Entreprise mise à jour avec succès.');
    }

    public function suspend(Company $company)
    {
        $company->update(['is_active' => false]);
        $company->currentSubscription()?->update(['status' => 'suspended']);
        return back()->with('success', "L'entreprise {$company->name} a été suspendue.");
    }

    public function activate(Company $company)
    {
        $company->update(['is_active' => true]);
        return back()->with('success', "L'entreprise {$company->name} a été activée.");
    }

    public function destroy(Company $company)
    {
        $company->delete();
        return redirect()->route('admin.companies.index')
            ->with('success', "Entreprise supprimée.");
    }
}
