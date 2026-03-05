<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityLog extends Model
{
    use HasFactory, BelongsToCompany;

    /**
     * Attributs modifiables en masse.
     */
    protected $fillable = [
        'company_id',
        'user_id',
        'action',
        'description',
        'subject_type',
        'subject_id',
        'properties',
        'ip_address',
    ];

    /**
     * Casts des attributs.
     */
    protected $casts = [
        'properties' => 'array',
    ];

    // ─── Relations ─────────────────────────────────────────────

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation polymorphique vers le sujet de l'action.
     */
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    // ─── Méthodes statiques ─────────────────────────────────────

    /**
     * Enregistrer une activité dans le journal.
     *
     * @param string      $action      Code de l'action (ex: 'check_in')
     * @param Model|null  $subject     Modèle concerné (Attendance, User, etc.)
     * @param string|null $description Description lisible par l'humain
     * @param array|null  $properties  Données additionnelles
     */
    public static function log(
        string $action,
        ?Model $subject = null,
        ?string $description = null,
        ?array $properties = null
    ): self {
        return static::create([
            'company_id'   => auth()->check() ? auth()->user()->company_id : null,
            'user_id'      => auth()->check() ? auth()->id() : null,
            'action'       => $action,
            'description'  => $description,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id'   => $subject?->getKey(),
            'properties'   => $properties,
            'ip_address'   => request()->ip(),
        ]);
    }
}
