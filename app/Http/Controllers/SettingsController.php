<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSettingsRequest;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Page des paramètres de l'entreprise.
     */
    public function index(): Response
    {
        $company = auth()->user()->company;

        return Inertia::render('Parametres/Index', [
            'company'         => $company,
            'defaultSettings' => \App\Models\Company::$defaultSettings,
        ]);
    }

    /**
     * Mettre à jour les paramètres de l'entreprise.
     */
    public function update(UpdateSettingsRequest $request)
    {
        $company = auth()->user()->company;
        $data    = $request->validated();

        $company->update([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'phone'    => $data['phone'] ?? null,
            'address'  => $data['address'] ?? null,
            'settings' => array_merge($company->settings ?? [], $data['settings'] ?? []),
        ]);

        return back()->with('success', 'Paramètres mis à jour avec succès.');
    }
}
