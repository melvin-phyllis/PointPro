<?php

namespace App\Services\SuperAdmin;

use App\Models\Attendance;
use App\Models\Company;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\SupportTicket;
use App\Models\User;
use Carbon\Carbon;

class DashboardStatsService
{
    public function getGlobalStats(): array
    {
        return [
            'total_companies'        => Company::count(),
            'active_companies'       => Company::where('is_active', true)->count(),
            'total_users'            => User::where('role', '!=', 'super_admin')->count(),
            'total_attendances_today'=> Attendance::whereDate('date', today())->count(),

            'companies_by_plan' => Company::selectRaw('plan, count(*) as count')
                ->groupBy('plan')
                ->pluck('count', 'plan')
                ->toArray(),

            'mrr'                   => $this->calculateMRR(),
            'revenue_this_month'    => (int) Payment::where('status', 'completed')
                ->whereMonth('paid_at', now()->month)
                ->whereYear('paid_at', now()->year)
                ->sum('amount'),
            'revenue_last_month'    => (int) Payment::where('status', 'completed')
                ->whereMonth('paid_at', now()->subMonth()->month)
                ->whereYear('paid_at', now()->subMonth()->year)
                ->sum('amount'),

            'new_companies_this_week'  => Company::where('created_at', '>=', now()->startOfWeek())->count(),
            'new_companies_this_month' => Company::where('created_at', '>=', now()->startOfMonth())->count(),

            'expiring_soon'  => Subscription::where('status', 'active')
                ->whereBetween('ends_at', [now(), now()->addDays(7)])
                ->count(),
            'expired_unpaid' => Subscription::where('status', 'expired')->count(),

            'open_tickets'   => SupportTicket::where('status', 'open')->count(),
            'urgent_tickets' => SupportTicket::where('priority', 'urgent')
                ->whereNotIn('status', ['resolved', 'closed'])
                ->count(),

            'revenue_chart' => $this->getRevenueChart(),
            'signups_chart' => $this->getSignupsChart(),

            'recent_payments' => Payment::with('company')
                ->where('status', 'completed')
                ->latest('paid_at')
                ->limit(5)
                ->get()
                ->map(fn($p) => [
                    'id'             => $p->id,
                    'company_name'   => $p->company?->name,
                    'amount'         => $p->formattedAmount(),
                    'payment_method' => $p->payment_method,
                    'paid_at'        => $p->paid_at?->diffForHumans(),
                ]),

            'expiring_subscriptions' => Subscription::with(['company', 'plan'])
                ->where('status', 'active')
                ->whereBetween('ends_at', [now(), now()->addDays(14)])
                ->orderBy('ends_at')
                ->limit(5)
                ->get()
                ->map(fn($s) => [
                    'company_name'  => $s->company?->name,
                    'plan_name'     => $s->plan?->name,
                    'ends_at'       => $s->ends_at->format('d/m/Y'),
                    'days_remaining'=> $s->daysRemaining(),
                ]),

            'urgent_ticket_list' => SupportTicket::with('company')
                ->where('priority', 'urgent')
                ->whereNotIn('status', ['resolved', 'closed'])
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn($t) => [
                    'id'            => $t->id,
                    'ticket_number' => $t->ticket_number,
                    'subject'       => $t->subject,
                    'company_name'  => $t->company?->name,
                    'created_at'    => $t->created_at->diffForHumans(),
                ]),
        ];
    }

    private function calculateMRR(): int
    {
        return (int) Subscription::where('status', 'active')
            ->join('plans', 'plans.id', '=', 'subscriptions.plan_id')
            ->sum('plans.price');
    }

    private function getRevenueChart(): array
    {
        return collect(range(11, 0))->map(function ($monthsAgo) {
            $date = now()->subMonths($monthsAgo);
            return [
                'month'  => $date->locale('fr')->isoFormat('MMM YYYY'),
                'amount' => (int) Payment::where('status', 'completed')
                    ->whereYear('paid_at', $date->year)
                    ->whereMonth('paid_at', $date->month)
                    ->sum('amount'),
            ];
        })->values()->toArray();
    }

    private function getSignupsChart(): array
    {
        return collect(range(11, 0))->map(function ($monthsAgo) {
            $date = now()->subMonths($monthsAgo);
            return [
                'month' => $date->locale('fr')->isoFormat('MMM YYYY'),
                'count' => Company::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        })->values()->toArray();
    }
}
