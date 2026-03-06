<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'subscription_id', 'amount', 'currency',
        'payment_method', 'payment_provider', 'provider_transaction_id',
        'provider_reference', 'status', 'paid_at', 'metadata', 'notes', 'created_by',
    ];

    protected $casts = [
        'metadata' => 'array',
        'paid_at'  => 'datetime',
        'amount'   => 'integer',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function formattedAmount(): string
    {
        return number_format($this->amount, 0, ',', ' ') . ' FCFA';
    }

    public function markAsCompleted(): void
    {
        $this->update(['status' => 'completed', 'paid_at' => now()]);
    }

    public function markAsFailed(): void
    {
        $this->update(['status' => 'failed']);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}
