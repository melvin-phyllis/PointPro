<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Company;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        // ── Stats globales ───────────────────────────────────────
        $totalCompanies  = Company::count();
        $activeCompanies = Company::where('is_active', true)->count();
        $totalUsers      = User::where('role', '!=', 'super_admin')->count();
        $todayPointages  = Attendance::whereDate('date', today())->count();

        // ── Répartition par plan ─────────────────────────────────
        $byPlan = Company::selectRaw('plan, count(*) as count')
            ->groupBy('plan')
            ->pluck('count', 'plan')
            ->toArray();

        // ── Revenus mensuels estimés ─────────────────────────────
        $prices      = ['starter' => 0, 'business' => 25000, 'enterprise' => 75000, 'custom' => 0];
        $monthlyRevenue = 0;
        foreach ($byPlan as $plan => $count) {
            $monthlyRevenue += ($prices[$plan] ?? 0) * $count;
        }

        // ── 5 dernières entreprises inscrites ───────────────────
        $recentCompanies = Company::withCount('users')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'id'          => $c->id,
                'name'        => $c->name,
                'plan'        => $c->plan,
                'is_active'   => $c->is_active,
                'users_count' => $c->users_count,
                'created_at'  => $c->created_at->diffForHumans(),
            ]);

        // ── Inscriptions par mois (6 derniers mois) ─────────────
        $growth = collect(range(5, 0))->map(function ($monthsAgo) {
            $date = now()->subMonths($monthsAgo);
            return [
                'month' => $date->locale('fr')->isoFormat('MMM'),
                'count' => Company::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_companies'  => $totalCompanies,
                'active_companies' => $activeCompanies,
                'total_users'      => $totalUsers,
                'today_pointages'  => $todayPointages,
                'monthly_revenue'  => $monthlyRevenue,
            ],
            'byPlan'          => $byPlan,
            'recentCompanies' => $recentCompanies,
            'growth'          => $growth,
        ]);
    }
}
