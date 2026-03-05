<?php

namespace App\Traits;

/**
 * Trait BelongsToCompany
 *
 * Filtre automatiquement les requêtes Eloquent par company_id (multi-tenant).
 * À utiliser sur tous les modèles métier sauf Company et User.
 */
trait BelongsToCompany
{
    /**
     * Initialiser le trait au démarrage du modèle.
     */
    protected static function bootBelongsToCompany(): void
    {
        // Scope global : filtre automatique par company_id
        static::addGlobalScope('company', function ($query) {
            if (auth()->check()) {
                $query->where(
                    (new static())->getTable() . '.company_id',
                    auth()->user()->company_id
                );
            }
        });

        // Assigner automatiquement company_id à la création
        static::creating(function ($model) {
            if (auth()->check() && empty($model->company_id)) {
                $model->company_id = auth()->user()->company_id;
            }
        });
    }
}
