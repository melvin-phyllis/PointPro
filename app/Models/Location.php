<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Location extends Model
{
    use HasFactory, SoftDeletes, BelongsToCompany;

    /**
     * Attributs modifiables en masse.
     */
    protected $fillable = [
        'company_id',
        'name',
        'address',
        'latitude',
        'longitude',
        'radius_meters',
        'is_active',
    ];

    /**
     * Casts des attributs.
     */
    protected $casts = [
        'latitude'      => 'float',
        'longitude'     => 'float',
        'radius_meters' => 'integer',
        'is_active'     => 'boolean',
    ];

    // ─── Relations ─────────────────────────────────────────────

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    // ─── Méthodes ──────────────────────────────────────────────

    /**
     * Vérifier si des coordonnées sont dans le rayon de cette zone.
     * Utilise la formule de Haversine.
     */
    public function isWithinRadius(float $lat, float $lng): bool
    {
        $distance = $this->calculateDistance($lat, $lng);
        return $distance <= $this->radius_meters;
    }

    /**
     * Calculer la distance en mètres entre un point et cette zone.
     * Formule de Haversine.
     */
    public function calculateDistance(float $lat, float $lng): float
    {
        $earthRadius = 6371000; // Rayon de la Terre en mètres

        $lat1 = deg2rad($this->latitude);
        $lng1 = deg2rad($this->longitude);
        $lat2 = deg2rad($lat);
        $lng2 = deg2rad($lng);

        $dLat = $lat2 - $lat1;
        $dLng = $lng2 - $lng1;

        $a = sin($dLat / 2) ** 2 + cos($lat1) * cos($lat2) * sin($dLng / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    // ─── Scopes ────────────────────────────────────────────────

    /**
     * Scope : uniquement les zones actives.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
