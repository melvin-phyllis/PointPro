<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur Super Admin : gestion des entreprises.
 */
class AdminCompanyController extends Controller
{
    /**
     * Liste de toutes les entreprises.
     */
    public function index(Request $request): Response
    {
        $query = Company::withTrashed()->withCount('users');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $companies = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Companies/Index', [
            'companies' => $companies,
            'filters'   => $request->only(['search']),
        ]);
    }

    /**
     * Détails d'une entreprise.
     */
    public function show(Company $company): Response
    {
        $company->load('users.department');

        return Inertia::render('Admin/Companies/Show', [
            'company' => $company->loadCount(['users', 'attendances', 'locations', 'departments']),
        ]);
    }

    /**
     * Mettre à jour une entreprise (plan, statut, etc.).
     */
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
}
