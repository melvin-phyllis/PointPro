<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Attributs modifiables en masse.
     */
    protected $fillable = [
        'company_id',
        'department_id',
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'role',
        'employee_id_number',
        'avatar_path',
        'is_active',
        'location_id',
    ];

    /**
     * Attributs masqués dans la sérialisation.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Attributs ajoutés automatiquement.
     */
    protected $appends = ['full_name'];

    /**
     * Casts des attributs.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
        ];
    }

    // ─── Relations ─────────────────────────────────────────────

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function assignedLocation(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(\App\Models\Location::class, 'location_id');
    }

    // ─── Email verification (queued) ───────────────────────────

    /**
     * Envoie la notification de vérification via la queue
     * pour ne pas bloquer la réponse HTTP.
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new \App\Notifications\QueuedVerifyEmail);
    }

    // ─── Accessors ─────────────────────────────────────────────

    /**
     * Nom complet de l'utilisateur.
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    // ─── Vérifications de rôle ─────────────────────────────────

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isManager(): bool
    {
        return $this->role === 'manager';
    }

    public function isEmployee(): bool
    {
        return $this->role === 'employee';
    }

    /**
     * Vérifie si l'utilisateur a un rôle parmi ceux donnés.
     */
    public function hasRole(string ...$roles): bool
    {
        return in_array($this->role, $roles);
    }

    // ─── Scopes ────────────────────────────────────────────────

    /**
     * Scope : uniquement les utilisateurs actifs.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope : filtrer par company_id (pour les super admins).
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }
}
