<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Attributs modifiables en masse.
     */
    protected $fillable = [
        'name',
        'slug',
        'email',
        'phone',
        'address',
        'logo_path',
        'settings',
        'plan',
        'subscription_ends_at',
        'is_active',
    ];

    /**
     * Casts des attributs.
     */
    protected $casts = [
        'settings'              => 'array',
        'is_active'             => 'boolean',
        'subscription_ends_at'  => 'datetime',
    ];

    /**
     * Paramètres par défaut de l'entreprise.
     */
    public static array $defaultSettings = [
        'work_start'               => '08:00',
        'work_end'                 => '17:00',
        'late_tolerance_minutes'   => 15,
        'early_check_in_minutes'   => 30,
        'auto_absent_after_minutes'=> 120,
        'lunch_break_minutes'      => 60,
        'timezone'                 => 'Africa/Abidjan',
        'working_days'             => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    ];

    /**
     * Features disponibles par plan.
     */
    protected static array $planFeatures = [
        'starter'    => ['basic_attendance'],
        'business'   => ['basic_attendance', 'geolocation', 'multi_site', 'reports', 'export'],
        'enterprise' => ['basic_attendance', 'geolocation', 'multi_site', 'reports', 'export', 'api_access', 'custom_reports', 'hr_integration'],
        'custom'     => ['basic_attendance', 'geolocation', 'multi_site', 'reports', 'export', 'api_access', 'custom_reports', 'hr_integration'],
    ];

    // ─── Relations ─────────────────────────────────────────────

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function supportTickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function currentSubscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->where('status', 'active')->latest();
    }

    // ─── Méthodes ──────────────────────────────────────────────

    /**
     * Vérifier si la company est sur un plan spécifique.
     */
    public function isOnPlan(string $plan): bool
    {
        return $this->plan === $plan;
    }

    /**
     * Récupérer un paramètre de configuration.
     */
    public function getSetting(string $key, mixed $default = null): mixed
    {
        $settings = array_merge(static::$defaultSettings, $this->settings ?? []);
        return $settings[$key] ?? $default;
    }

    /**
     * Vérifie si une date donnée est un jour ouvré pour cette entreprise.
     */
    public function isWorkingDay(\Carbon\Carbon $date): bool
    {
        $workingDays = (array) $this->getSetting('working_days', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
        return in_array(strtolower($date->englishDayOfWeek), $workingDays);
    }

    /**
     * Vérifier si la company a accès à une fonctionnalité.
     */
    public function hasFeature(string $feature): bool
    {
        $features = static::$planFeatures[$this->plan] ?? static::$planFeatures['starter'];
        return in_array($feature, $features);
    }

    /**
     * Vérifier si l'abonnement est actif.
     */
    public function isSubscriptionActive(): bool
    {
        if ($this->plan === 'starter') {
            return true;
        }

        if (is_null($this->subscription_ends_at)) {
            return true;
        }

        return $this->subscription_ends_at->isFuture();
    }

    public function hasActiveSubscription(): bool
    {
        return $this->currentSubscription()->exists();
    }

    public function currentPlanName(): string
    {
        return $this->currentSubscription?->plan?->name ?? ucfirst($this->plan);
    }

    public function totalPaid(): int
    {
        return (int) $this->payments()->where('status', 'completed')->sum('amount');
    }
}
