<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Company;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    public function createManualPayment(
        Company $company,
        Plan $plan,
        int $amount,
        string $paymentMethod,
        array $metadata = [],
        ?string $notes = null,
        ?string $duration = null
    ): Payment {
        $payment = Payment::create([
            'company_id'     => $company->id,
            'amount'         => $amount,
            'currency'       => 'XOF',
            'payment_method' => $paymentMethod,
            'status'         => 'completed',
            'paid_at'        => now(),
            'metadata'       => $metadata,
            'notes'          => $notes,
            'created_by'     => auth()->id(),
        ]);

        $subscription = $this->renewSubscription($company, $plan, $payment, $duration);

        $payment->update(['subscription_id' => $subscription->id]);

        // Générer la facture
        (new InvoiceService())->generateInvoice($payment, $company, $plan);

        // Activer l'entreprise si suspendue
        if (! $company->is_active) {
            $company->update(['is_active' => true]);
        }

        // Mettre à jour le plan sur la company
        $company->update([
            'plan'                  => $plan->slug,
            'subscription_ends_at'  => $subscription->ends_at,
        ]);

        Log::info("Paiement manuel créé", [
            'company_id' => $company->id,
            'amount'     => $amount,
            'plan'       => $plan->slug,
        ]);

        return $payment;
    }

    public function renewSubscription(Company $company, Plan $plan, Payment $payment, ?string $duration = null): Subscription
    {
        // Expirer l'ancienne subscription active
        Subscription::where('company_id', $company->id)
            ->where('status', 'active')
            ->update(['status' => 'expired']);

        $startsAt = now();
        $endsAt   = match ($duration) {
            '1_month'   => now()->addMonth(),
            '3_months'   => now()->addMonths(3),
            '1_year'     => now()->addYear(),
            default      => $this->endsAtFromPlanBillingCycle($plan),
        };

        return Subscription::create([
            'company_id' => $company->id,
            'plan_id'    => $plan->id,
            'status'     => 'active',
            'starts_at'  => $startsAt,
            'ends_at'    => $endsAt,
        ]);
    }

    private function endsAtFromPlanBillingCycle(Plan $plan): Carbon
    {
        return match ($plan->billing_cycle ?? 'monthly') {
            'quarterly' => now()->addMonths(3),
            'yearly'    => now()->addYear(),
            default     => now()->addMonth(),
        };
    }

    public function handlePaymentWebhook(string $provider, array $data): void
    {
        $transactionId = match($provider) {
            'cinetpay' => $data['cpm_trans_id'] ?? null,
            'fedapay'  => $data['transaction']['id'] ?? null,
            'wave'     => $data['client_reference'] ?? null,
            default    => null,
        };

        if (! $transactionId) {
            return;
        }

        $payment = Payment::where('provider_transaction_id', $transactionId)->first();
        if (! $payment) {
            return;
        }

        $success = match($provider) {
            'cinetpay' => ($data['cpm_result'] ?? '') === '00',
            'fedapay'  => ($data['name'] ?? '') === 'transaction.approved',
            'wave'     => ($data['payment_status'] ?? '') === 'succeeded',
            default    => false,
        };

        if ($success) {
            $payment->markAsCompleted();
            $company = $payment->company;
            $plan    = $payment->subscription?->plan ?? Plan::find($data['plan_id'] ?? null);
            if ($company && $plan) {
                $sub = $this->renewSubscription($company, $plan, $payment);
                $payment->update(['subscription_id' => $sub->id]);
                (new InvoiceService())->generateInvoice($payment, $company, $plan);
            }
        } else {
            $payment->markAsFailed();
        }
    }
}
