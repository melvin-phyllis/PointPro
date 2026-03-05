<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDepartmentRequest;
use App\Models\Department;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    /**
     * Liste des départements.
     */
    public function index(): Response
    {
        $departments = Department::with('manager:id,first_name,last_name')
            ->withCount(['users as employee_count' => fn($q) => $q->where('is_active', true)])
            ->get();

        return Inertia::render('Departements/Index', [
            'departments' => $departments,
        ]);
    }

    /**
     * Formulaire de création d'un département.
     */
    public function create(): Response
    {
        $managers = User::active()
            ->whereIn('role', ['manager', 'admin'])
            ->select('id', 'first_name', 'last_name')
            ->get();

        return Inertia::render('Departements/Create', [
            'managers' => $managers,
        ]);
    }

    /**
     * Enregistrer un département.
     */
    public function store(StoreDepartmentRequest $request)
    {
        Department::create($request->validated());

        return redirect()->route('departements.index')
            ->with('success', 'Département créé avec succès.');
    }

    /**
     * Formulaire d'édition d'un département.
     */
    public function edit(Department $departement): Response
    {
        $managers = User::active()
            ->whereIn('role', ['manager', 'admin'])
            ->select('id', 'first_name', 'last_name')
            ->get();

        return Inertia::render('Departements/Edit', [
            'department' => $departement->load('manager:id,first_name,last_name'),
            'managers'   => $managers,
        ]);
    }

    /**
     * Mettre à jour un département.
     */
    public function update(StoreDepartmentRequest $request, Department $departement)
    {
        $departement->update($request->validated());

        return redirect()->route('departements.index')
            ->with('success', 'Département mis à jour avec succès.');
    }

    /**
     * Supprimer un département.
     */
    public function destroy(Department $departement)
    {
        // Dissocier les employés du département
        User::where('department_id', $departement->id)
            ->update(['department_id' => null]);

        $departement->delete();

        return redirect()->route('departements.index')
            ->with('success', 'Département supprimé avec succès.');
    }
}
