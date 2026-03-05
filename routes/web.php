<?php

use App\Http\Controllers\Admin\AdminCompanyController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Page d'accueil ───────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// ─── Page abonnement expiré ────────────────────────────────────
Route::get('/abonnement-expire', function () {
    return Inertia::render('SubscriptionExpired');
})->name('subscription.expired');

// ─── Routes protégées (utilisateurs connectés et vérifiés) ─────
Route::middleware(['auth', 'verified', 'company.active'])->group(function () {

    // Tableau de bord (redirige super_admin vers son propre dashboard)
    Route::get('/dashboard', function () {
        if (auth()->user()->role === 'super_admin') {
            return redirect()->route('admin.dashboard');
        }
        return app(DashboardController::class)->index();
    })->name('dashboard');

    // ─── Pointage (tous les rôles) ──────────────────────────────
    Route::get('/pointage', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/pointage/check-in', [AttendanceController::class, 'checkIn'])->name('attendance.check-in');
    Route::post('/pointage/check-out', [AttendanceController::class, 'checkOut'])->name('attendance.check-out');
    Route::get('/pointage/historique', [AttendanceController::class, 'history'])->name('attendance.history');

    // ─── Admin & Manager ────────────────────────────────────────
    Route::middleware(['role:admin,manager'])->group(function () {
        Route::get('/equipe', [TeamController::class, 'index'])->name('team.index');
        Route::get('/equipe/aujourd-hui', [TeamController::class, 'today'])->name('team.today');
        Route::get('/equipe/export', [TeamController::class, 'exportCsv'])->name('team.export');
        Route::get('/equipe/export-periode', [TeamController::class, 'exportPeriod'])->name('team.export.period');
    });

    // ─── Admin seulement ────────────────────────────────────────
    Route::middleware(['role:admin'])->group(function () {
        // Employés
        Route::resource('employes', EmployeeController::class);
        Route::get('employes-export', [EmployeeController::class, 'export'])->name('employes.export');
        Route::get('employes/{employe}/presences', [EmployeeController::class, 'presences'])->name('employes.presences');
        Route::get('employes/{employe}/presences/export', [EmployeeController::class, 'presencesExport'])->name('employes.presences.export');

        // Départements
        Route::resource('departements', DepartmentController::class);

        // Zones géographiques
        Route::resource('zones', LocationController::class);

        // Rapports
        Route::get('/rapports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/rapports/mensuel', [ReportController::class, 'monthly'])->name('reports.monthly');
        Route::get('/rapports/export/{format}', [ReportController::class, 'export'])->name('reports.export');

        // Paramètres entreprise
        Route::get('/parametres', [SettingsController::class, 'index'])->name('settings.index');
        Route::put('/parametres', [SettingsController::class, 'update'])->name('settings.update');
    });

    // ─── Profil utilisateur ─────────────────────────────────────
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ─── Super Admin ───────────────────────────────────────────────
Route::middleware(['auth', 'role:super_admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/entreprises', [AdminCompanyController::class, 'index'])->name('companies.index');
        Route::get('/entreprises/{company}', [AdminCompanyController::class, 'show'])->name('companies.show');
        Route::put('/entreprises/{company}', [AdminCompanyController::class, 'update'])->name('companies.update');
    });

require __DIR__ . '/auth.php';
