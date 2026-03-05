<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory, BelongsToCompany;

    /**
     * Attributs modifiables en masse.
     */
    protected $fillable = [
        'user_id',
        'company_id',
        'date',
        'check_in',
        'check_out',
        'check_in_latitude',
        'check_in_longitude',
        'check_out_latitude',
        'check_out_longitude',
        'check_in_location_id',
        'check_out_location_id',
        'status',
        'late_minutes',
        'worked_hours',
        'overtime_hours',
        'is_geo_verified',
        'notes',
    ];

    /**
     * Casts des attributs.
     */
    protected $casts = [
        'date'                  => 'date',
        'check_in'              => 'datetime',
        'check_out'             => 'datetime',
        'check_in_latitude'     => 'float',
        'check_in_longitude'    => 'float',
        'check_out_latitude'    => 'float',
        'check_out_longitude'   => 'float',
        'late_minutes'          => 'integer',
        'worked_hours'          => 'float',
        'overtime_hours'        => 'float',
        'is_geo_verified'       => 'boolean',
    ];

    // ─── Relations ─────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function checkInLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'check_in_location_id');
    }

    public function checkOutLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'check_out_location_id');
    }

    // ─── Accessors ─────────────────────────────────────────────

    /**
     * Vérifier si l'employé est en retard.
     */
    public function isLate(): bool
    {
        return $this->status === 'late' || $this->late_minutes > 0;
    }

    /**
     * Durée travaillée formatée (ex: "8h 30min").
     */
    public function getWorkedDurationAttribute(): string
    {
        if (is_null($this->worked_hours)) {
            return '—';
        }

        $hours   = floor($this->worked_hours);
        $minutes = round(($this->worked_hours - $hours) * 60);

        if ($minutes === 0) {
            return "{$hours}h";
        }

        return "{$hours}h {$minutes}min";
    }

    // ─── Scopes ────────────────────────────────────────────────

    /**
     * Scope : pointages d'une date spécifique.
     */
    public function scopeForDate($query, $date)
    {
        return $query->where('date', $date);
    }

    /**
     * Scope : pointages d'un mois/année.
     */
    public function scopeForMonth($query, int $year, int $month)
    {
        return $query->whereYear('date', $year)->whereMonth('date', $month);
    }

    /**
     * Scope : filtrer par statut.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope : pointages des N derniers jours.
     */
    public function scopeLastDays($query, int $days)
    {
        return $query->where('date', '>=', now()->subDays($days)->toDateString());
    }
}
