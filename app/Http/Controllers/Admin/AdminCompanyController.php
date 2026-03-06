<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Payment;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminCompanyController extends Controller
{
    public function index(Request $request): Response
    {
        $companies = Company::withTrashed()
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
            'filters'   => $request->only(['search', 'plan', 'status']),
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

        return Inertia::render('Admin/Companies/Show', [
            'company'  => $company,
            'payments' => $payments,
            'tickets'  => $tickets,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Companies/Create');
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
            'plan'                 => 'sometimes|in:starter,business,enterprise,custom',
            'is_active'            => 'sometimes|boolean',
            'subscription_ends_at' => 'sometimes|nullable|date',
        ]);

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
