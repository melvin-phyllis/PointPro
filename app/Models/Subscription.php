<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'plan_id', 'status', 'starts_at', 'ends_at',
        'trial_ends_at', 'cancelled_at', 'cancellation_reason',
    ];

    protected $casts = [
        'starts_at'      => 'datetime',
        'ends_at'        => 'datetime',
        'trial_ends_at'  => 'datetime',
        'cancelled_at'   => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && $this->ends_at > now();
    }

    public function isExpired(): bool
    {
        return $this->ends_at < now();
    }

    public function isTrial(): bool
    {
        return $this->trial_ends_at !== null && $this->trial_ends_at > now();
    }

    public function daysRemaining(): int
    {
        return max(0, (int) now()->diffInDays($this->ends_at, false));
    }

    public function renew(int $months = 1): void
    {
        $base = $this->ends_at > now() ? $this->ends_at : now();
        $this->update([
            'ends_at' => $base->addMonths($months),
            'status'  => 'active',
        ]);
    }
}
