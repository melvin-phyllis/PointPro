<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware : vérifie que la company de l'utilisateur est active,
 * que la démo n'est pas expirée (ou qu'un abonnement est actif).
 */
class EnsureCompanyIsActive
{
    /** Routes autorisées quand la démo est expirée (pour finaliser compte / payer). */
    private const TRIAL_EXPIRED_ALLOWED = [
        'demo.expired',
        'finalize-account',
        'finalize-account.store',
        'subscription.index',
        'payment.success',
        'payment.cancel',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        $company = $user->company;

        if (! $company) {
            auth()->logout();
            return redirect()->route('login')
                ->with('error', 'Votre compte n\'est associé à aucune entreprise.');
        }

        if (! $company->is_active) {
            return redirect()->route('subscription.expired')
                ->with('error', 'Votre entreprise a été désactivée. Contactez le support.');
        }

        // Démo expirée : rediriger vers la page démo expirée sauf pour les routes autorisées
        if ($company->isTrialExpired()) {
            $current = $request->route()?->getName();
            $allowed = in_array($current, self::TRIAL_EXPIRED_ALLOWED, true)
                || (is_string($current) && (str_starts_with($current, 'subscription.') || str_starts_with($current, 'payment.')));
            if (! $allowed) {
                return redirect()->route('demo.expired');
            }
            return $next($request);
        }

        // Abonnement (hors démo) expiré : on laisse passer ; l'overlay dans le layout affiche le message
        return $next($request);
    }
}
