<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware : vérifie que l'utilisateur a le rôle requis.
 * Usage : route()->middleware('role:admin') ou 'role:admin,manager'
 */
class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Les super admins ont accès à tout
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Vérifier si le rôle de l'utilisateur est dans la liste autorisée
        if (!$user->hasRole(...$roles)) {
            abort(403, 'Accès non autorisé. Vous n\'avez pas les permissions nécessaires.');
        }

        return $next($request);
    }
}
