<?php

namespace App\Console\Commands;

use App\Mail\SubscriptionExpiring;
use App\Models\Subscription;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class CheckExpiringSubscriptions extends Command
{
    protected $signature = 'subscriptions:check-expiring {--days=7 : Nombre de jours avant expiration}';
    protected $description = 'Notifie les entreprises dont l\'abonnement expire dans N jours';

    public function handle(): int
    {
        $days = (int) $this->option('days');

        $subscriptions = Subscription::with(['company', 'plan'])
            ->where('status', 'active')
            ->whereBetween('ends_at', [now(), now()->addDays($days)])
            ->get();

        if ($subscriptions->isEmpty()) {
            $this->info("Aucun abonnement n'expire dans les {$days} prochains jours.");
            return self::SUCCESS;
        }

        $count = 0;
        foreach ($subscriptions as $subscription) {
            if (!$subscription->company?->email) continue;

            Mail::to($subscription->company->email)
                ->send(new SubscriptionExpiring($subscription));
            $count++;

            $this->line("  ✉ Notifié : {$subscription->company->name} (expire le {$subscription->ends_at->format('d/m/Y')})");
        }

        $this->info("✅ {$count} notification(s) envoyée(s).");

        return self::SUCCESS;
    }
}
