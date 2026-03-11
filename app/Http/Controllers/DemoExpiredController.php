<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DemoExpiredController extends Controller
{
    public function index(Request $request): RedirectResponse|Response
    {
        $user = $request->user();
        if ($user->isSuperAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        $company = $user->company;
        if (! $company || ! $company->isTrialExpired()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('DemoExpired', [
            'company' => [
                'name' => $company->name,
                'trial_ends_at' => $company->trial_ends_at?->toIso8601String(),
            ],
        ]);
    }
}
