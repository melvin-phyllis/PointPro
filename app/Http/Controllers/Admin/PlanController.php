<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::withCount('subscriptions')->ordered()->get();
        return Inertia::render('Admin/Plans/Index', ['plans' => $plans]);
    }

    public function create()
    {
        return Inertia::render('Admin/Plans/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:100',
            'slug'          => 'required|string|max:100|unique:plans',
            'price'         => 'required|integer|min:0',
            'max_employees' => 'nullable|integer|min:1',
            'max_locations' => 'required|integer|min:1',
            'features'      => 'required|array',
            'billing_cycle' => 'required|in:monthly,quarterly,yearly',
            'is_active'     => 'boolean',
            'sort_order'    => 'integer|min:0',
        ]);

        Plan::create($validated);

        return redirect()->route('admin.plans.index')->with('success', 'Plan créé avec succès.');
    }

    public function edit(Plan $plan)
    {
        return Inertia::render('Admin/Plans/Edit', ['plan' => $plan]);
    }

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:100',
            'price'         => 'required|integer|min:0',
            'max_employees' => 'nullable|integer|min:1',
            'max_locations' => 'required|integer|min:1',
            'features'      => 'required|array',
            'billing_cycle' => 'required|in:monthly,quarterly,yearly',
            'is_active'     => 'boolean',
            'sort_order'    => 'integer|min:0',
        ]);

        $plan->update($validated);

        return redirect()->route('admin.plans.index')->with('success', 'Plan mis à jour.');
    }

    public function destroy(Plan $plan)
    {
        if ($plan->subscriptions()->where('status', 'active')->exists()) {
            return back()->with('error', 'Impossible de supprimer un plan avec des abonnements actifs.');
        }
        $plan->delete();
        return redirect()->route('admin.plans.index')->with('success', 'Plan supprimé.');
    }
}
