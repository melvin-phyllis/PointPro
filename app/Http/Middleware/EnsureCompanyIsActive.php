<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware : vérifie que la company de l'utilisateur est active
 * et que l'abonnement n'est pas expiré.
 */
class EnsureCompanyIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Les super admins passent toujours
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        $company = $user->company;

        // Vérifier si la company existe
        if (!$company) {
            auth()->logout();
            return redirect()->route('login')
                ->with('error', 'Votre compte n\'est associé à aucune entreprise.');
        }

        // Vérifier si la company est active
        if (!$company->is_active) {
            return redirect()->route('subscription.expired')
                ->with('error', 'Votre entreprise a été désactivée. Contactez le support.');
        }

        // Vérifier si l'abonnement est actif
        if (!$company->isSubscriptionActive()) {
            return redirect()->route('subscription.expired')
                ->with('error', 'Votre abonnement a expiré. Veuillez renouveler votre abonnement.');
        }

        return $next($request);
    }
}
