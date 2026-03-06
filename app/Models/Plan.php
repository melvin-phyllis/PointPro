<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'price', 'currency', 'max_employees',
        'max_locations', 'features', 'billing_cycle', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'features'      => 'array',
        'is_active'     => 'boolean',
        'price'         => 'integer',
        'max_employees' => 'integer',
        'max_locations' => 'integer',
        'sort_order'    => 'integer',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    public function formattedPrice(): string
    {
        if ($this->price === 0) {
            return 'Gratuit';
        }
        return number_format($this->price, 0, ',', ' ') . ' FCFA/mois';
    }

    public function hasFeature(string $feature): bool
    {
        return (bool) ($this->features[$feature] ?? false);
    }

    public function isFreePlan(): bool
    {
        return $this->price === 0;
    }
}
