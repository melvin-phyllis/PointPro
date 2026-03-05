<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ─── Tâches planifiées ─────────────────────────────────────
// Marquer les absents chaque matin à 10h (jours ouvrés)
Schedule::command('app:mark-absentees')->weekdays()->at('10:00');

// Rappels de pointage aux employés sans check-in (08:30)
Schedule::command('app:send-reminders')->weekdays()->at('08:30');

// Rapport mensuel aux admins (1er du mois à 08:00)
Schedule::command('app:send-monthly-report')->monthlyOn(1, '08:00');
