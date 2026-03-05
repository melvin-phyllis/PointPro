<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLocationRequest;
use App\Models\Location;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    /**
     * Liste des zones géographiques.
     */
    public function index(): Response
    {
        $locations = Location::withTrashed()
            ->where('company_id', auth()->user()->company_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('Zones/Index', [
            'locations' => $locations,
        ]);
    }

    /**
     * Formulaire de création d'une zone.
     */
    public function create(): Response
    {
        return Inertia::render('Zones/Create');
    }

    /**
     * Enregistrer une zone géographique.
     */
    public function store(StoreLocationRequest $request)
    {
        Location::create($request->validated());

        return redirect()->route('zones.index')
            ->with('success', 'Zone géographique créée avec succès.');
    }

    /**
     * Formulaire d'édition d'une zone.
     */
    public function edit(Location $zone): Response
    {
        return Inertia::render('Zones/Edit', [
            'location' => $zone,
        ]);
    }

    /**
     * Mettre à jour une zone géographique.
     */
    public function update(StoreLocationRequest $request, Location $zone)
    {
        $zone->update($request->validated());

        return redirect()->route('zones.index')
            ->with('success', 'Zone géographique mise à jour avec succès.');
    }

    /**
     * Supprimer une zone géographique.
     */
    public function destroy(Location $zone)
    {
        $zone->delete();

        return redirect()->route('zones.index')
            ->with('success', 'Zone géographique supprimée avec succès.');
    }
}
