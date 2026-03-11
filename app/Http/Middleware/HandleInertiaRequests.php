<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * Vue racine chargée au premier accès.
     */
    protected $rootView = 'app';

    /**
     * Version des assets (pour le cache busting).
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Données partagées sur toutes les pages Inertia.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),

            // Données d'authentification
            'auth' => [
                'user' => $user ? [
                    'id'                  => $user->id,
                    'full_name'           => $user->full_name,
                    'first_name'          => $user->first_name,
                    'last_name'           => $user->last_name,
                    'email'               => $user->email,
                    'role'                => $user->role,
                    'company_id'          => $user->company_id,
                    'department_id'       => $user->department_id,
                    'avatar_path'         => $user->avatar_path,
                    'is_active'           => $user->is_active,
                    'email_verified_at'   => $user->email_verified_at,
                ] : null,
            ],

            // Données de la company (si connecté)
            'company' => $user ? fn() => $user->company ? [
                'id'       => $user->company->id,
                'name'     => $user->company->name,
                'plan'     => $user->company->plan,
                'settings' => $user->company->settings,
                'logo_path'=> $user->company->logo_path,
            ] : null : null,

            // Messages flash
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error'   => fn() => $request->session()->get('error'),
                'info'    => fn() => $request->session()->get('info'),
            ],

            // URL de base pour les assets publics (ex: http://localhost/PointPro/public)
            'asset_url' => rtrim(asset(''), '/'),

            // Ziggy (routes JS)
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            // Abonnement expiré (soft block : afficher overlay au lieu de rediriger)
            'subscription_expired' => fn() => $this->resolveSubscriptionExpired($request),
        ];
    }

    /**
     * True si l'utilisateur est connecté, a une company active, n'est pas en démo expirée,
     * mais l'abonnement payant est expiré (affichage overlay dans le layout).
     */
    private function resolveSubscriptionExpired(Request $request): bool
    {
        $user = $request->user();
        if (! $user || $user->isSuperAdmin()) {
            return false;
        }
        $company = $user->company;
        if (! $company || ! $company->is_active) {
            return false;
        }
        if ($company->isTrialExpired()) {
            return false;
        }
        return ! $company->isSubscriptionActive();
    }
}
