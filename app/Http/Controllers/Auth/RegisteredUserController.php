<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Page d'inscription / onboarding entreprise.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Créer l'entreprise et son compte administrateur.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'first_name'   => ['required', 'string', 'max:100'],
            'last_name'    => ['required', 'string', 'max:100'],
            'email'        => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password'     => ['required', 'confirmed', Rules\Password::defaults()],
            'plan'         => ['required', 'in:starter,business,enterprise'],
        ]);

        // Générer un slug unique pour l'entreprise
        $slug = Str::slug($request->company_name);
        $base = $slug;
        $i    = 1;
        while (Company::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }

        // Créer l'entreprise
        $company = Company::create([
            'name'     => $request->company_name,
            'slug'     => $slug,
            'email'    => $request->email,
            'plan'     => $request->plan,
            'is_active'=> true,
            'settings' => [
                'work_start'     => '08:00',
                'work_end'       => '17:00',
                'late_tolerance' => 15,
                'lunch_duration' => 60,
                'timezone'       => 'Africa/Abidjan',
            ],
        ]);

        // Créer l'administrateur de l'entreprise
        $user = User::create([
            'company_id' => $company->id,
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => 'admin',
            'is_active'  => true,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
