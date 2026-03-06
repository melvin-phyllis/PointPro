<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'payment_id', 'invoice_number', 'amount', 'currency',
        'tax_amount', 'total_amount', 'description', 'status',
        'due_date', 'paid_at', 'sent_at', 'billing_details',
    ];

    protected $casts = [
        'billing_details' => 'array',
        'due_date'        => 'date',
        'paid_at'         => 'datetime',
        'sent_at'         => 'datetime',
        'amount'          => 'integer',
        'tax_amount'      => 'integer',
        'total_amount'    => 'integer',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public static function generateNumber(): string
    {
        $year  = now()->year;
        $count = self::whereYear('created_at', $year)->count() + 1;
        return 'INV-' . $year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    public function markAsPaid(): void
    {
        $this->update(['status' => 'paid', 'paid_at' => now()]);
    }

    public function markAsSent(): void
    {
        $this->update(['status' => 'sent', 'sent_at' => now()]);
    }

    public function isOverdue(): bool
    {
        return $this->status !== 'paid' && $this->due_date->isPast();
    }
}
