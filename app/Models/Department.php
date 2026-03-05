<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes, BelongsToCompany;

    /**
     * Attributs modifiables en masse.
     */
    protected $fillable = [
        'company_id',
        'name',
        'manager_id',
    ];

    /**
     * Attributs ajoutés automatiquement.
     */
    protected $appends = ['employee_count'];

    // ─── Relations ─────────────────────────────────────────────

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Le manager du département.
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    // ─── Accessors ─────────────────────────────────────────────

    /**
     * Nombre d'employés dans le département.
     */
    public function getEmployeeCountAttribute(): int
    {
        return $this->users()->count();
    }
}
