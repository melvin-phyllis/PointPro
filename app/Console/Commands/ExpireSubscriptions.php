<?php

namespace App\Console\Commands;

use App\Mail\SubscriptionExpired;
use App\Models\Subscription;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class ExpireSubscriptions extends Command
{
    protected $signature = 'subscriptions:expire';
    protected $description = 'Passe les abonnements expirés en statut "expired" et notifie les entreprises';

    public function handle(): int
    {
        $subscriptions = Subscription::with(['company', 'plan'])
            ->where('status', 'active')
            ->where('ends_at', '<', now())
            ->get();

        if ($subscriptions->isEmpty()) {
            $this->info('Aucun abonnement à expirer.');
            return self::SUCCESS;
        }

        $count = 0;
        foreach ($subscriptions as $subscription) {
            $subscription->update(['status' => 'expired']);
            $count++;

            if ($subscription->company?->email) {
                Mail::to($subscription->company->email)
                    ->send(new SubscriptionExpired($subscription));
            }

            $this->line("  ⏰ Expiré : {$subscription->company?->name} (plan : {$subscription->plan?->name})");
        }

        $this->info("✅ {$count} abonnement(s) expiré(s).");

        return self::SUCCESS;
    }
}
