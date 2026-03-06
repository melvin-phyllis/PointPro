<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SupportTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'user_id', 'ticket_number', 'subject', 'category',
        'priority', 'status', 'assigned_to', 'resolved_at', 'closed_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
        'closed_at'   => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(TicketMessage::class, 'ticket_id');
    }

    public static function generateTicketNumber(): string
    {
        $year  = now()->year;
        $count = self::whereYear('created_at', $year)->count() + 1;
        return 'TK-' . $year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    public function resolve(): void
    {
        $this->update(['status' => 'resolved', 'resolved_at' => now()]);
    }

    public function close(): void
    {
        $this->update(['status' => 'closed', 'closed_at' => now()]);
    }

    public function reopen(): void
    {
        $this->update(['status' => 'open', 'resolved_at' => null]);
    }

    public function lastMessage(): ?TicketMessage
    {
        return $this->messages()->latest()->first();
    }
}
