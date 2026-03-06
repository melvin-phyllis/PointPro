<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Plan;

class InvoiceService
{
    public function generateInvoice(Payment $payment, Company $company, Plan $plan): Invoice
    {
        $status = $payment->isCompleted() ? 'paid' : 'draft';

        return Invoice::create([
            'company_id'     => $company->id,
            'payment_id'     => $payment->id,
            'invoice_number' => Invoice::generateNumber(),
            'amount'         => $payment->amount,
            'currency'       => 'XOF',
            'tax_amount'     => 0,
            'total_amount'   => $payment->amount,
            'description'    => "Abonnement PointPro — Plan {$plan->name}",
            'status'         => $status,
            'due_date'       => now()->addDays(7),
            'paid_at'        => $payment->isCompleted() ? $payment->paid_at : null,
            'billing_details'=> [
                'company_name' => $company->name,
                'email'        => $company->email,
                'address'      => $company->address,
                'plan'         => $plan->name,
                'plan_price'   => $plan->formattedPrice(),
            ],
        ]);
    }
}
