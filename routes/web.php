<?php

use App\Http\Controllers\Admin\AdminCompanyController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\QuoteRequestController as AdminQuoteRequestController;
use App\Http\Controllers\Admin\TicketController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ClientTicketController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\QuoteRequestController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Page d'accueil ───────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// ─── Demande de devis (invités) ────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/demande-devis', [QuoteRequestController::class, 'create'])->name('quote.request');
    Route::post('/demande-devis', [QuoteRequestController::class, 'store'])->name('quote.request.store');
    Route::get('/demande-devis/merci', [QuoteRequestController::class, 'thankYou'])->name('quote.request.thank-you');
});

// ─── Page abonnement expiré ────────────────────────────────────
Route::get('/abonnement-expire', function () {
    return Inertia::render('SubscriptionExpired');
})->name('subscription.expired');

// ─── Webhooks paiement (SANS auth) ─────────────────────────────
Route::post('/webhooks/cinetpay', [WebhookController::class, 'cinetpay'])->name('webhooks.cinetpay');
Route::post('/webhooks/fedapay',  [WebhookController::class, 'fedapay'])->name('webhooks.fedapay');
Route::post('/webhooks/wave',     [WebhookController::class, 'wave'])->name('webhooks.wave');

// ─── Démo expirée + Finaliser compte (auth, verified ; sans company.active pour être accessibles quand démo expirée)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/demo-expire', [\App\Http\Controllers\DemoExpiredController::class, 'index'])->name('demo.expired');
    Route::get('/finaliser-compte', [\App\Http\Controllers\FinalizeAccountController::class, 'create'])->name('finalize-account');
    Route::post('/finaliser-compte', [\App\Http\Controllers\FinalizeAccountController::class, 'store'])->name('finalize-account.store');
});

// ─── Routes protégées (utilisateurs connectés et vérifiés) ─────
Route::middleware(['auth', 'verified', 'company.active'])->group(function () {

    // Tableau de bord
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

        // Support client
        Route::get('/support', [ClientTicketController::class, 'index'])->name('client.tickets.index');
        Route::get('/support/create', [ClientTicketController::class, 'create'])->name('client.tickets.create');
        Route::post('/support', [ClientTicketController::class, 'store'])->name('client.tickets.store');
        Route::get('/support/{ticket}', [ClientTicketController::class, 'show'])->name('client.tickets.show');
        Route::post('/support/{ticket}/reply', [ClientTicketController::class, 'reply'])->name('client.tickets.reply');
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

        // Abonnement
        Route::get('/abonnement', [SubscriptionController::class, 'index'])->name('subscription.index');
        Route::get('/abonnement/success', [SubscriptionController::class, 'success'])->name('payment.success');
        Route::get('/abonnement/cancel', [SubscriptionController::class, 'cancel'])->name('payment.cancel');
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

        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Entreprises
        Route::get('/entreprises', [AdminCompanyController::class, 'index'])->name('companies.index');
        Route::get('/entreprises/create', [AdminCompanyController::class, 'create'])->name('companies.create');
        Route::post('/entreprises', [AdminCompanyController::class, 'store'])->name('companies.store');
        Route::get('/entreprises/{company}', [AdminCompanyController::class, 'show'])->name('companies.show');
        Route::put('/entreprises/{company}', [AdminCompanyController::class, 'update'])->name('companies.update');
        Route::post('/entreprises/{company}/abonnement', [AdminCompanyController::class, 'storeSubscription'])->name('companies.subscription.store');
        Route::post('/entreprises/{company}/suspend', [AdminCompanyController::class, 'suspend'])->name('companies.suspend');
        Route::post('/entreprises/{company}/activate', [AdminCompanyController::class, 'activate'])->name('companies.activate');
        Route::delete('/entreprises/{company}', [AdminCompanyController::class, 'destroy'])->name('companies.destroy');

        // Plans tarifaires
        Route::resource('/plans', PlanController::class)->names('plans');

        // Paiements
        Route::get('/paiements', [PaymentController::class, 'index'])->name('payments.index');
        Route::get('/paiements/create', [PaymentController::class, 'create'])->name('payments.create');
        Route::post('/paiements', [PaymentController::class, 'store'])->name('payments.store');
        Route::get('/paiements/{payment}', [PaymentController::class, 'show'])->name('payments.show');

        // Factures
        Route::get('/factures', [InvoiceController::class, 'index'])->name('invoices.index');
        Route::post('/factures/{invoice}/send', [InvoiceController::class, 'send'])->name('invoices.send');

        // Demandes de devis
        Route::get('/demandes-devis', [AdminQuoteRequestController::class, 'index'])->name('quote-requests.index');
        Route::get('/demandes-devis/{quoteRequest}', [AdminQuoteRequestController::class, 'show'])->name('quote-requests.show');
        Route::post('/demandes-devis/{quoteRequest}/create-company', [AdminQuoteRequestController::class, 'createCompany'])->name('quote-requests.create-company');
        Route::post('/demandes-devis/{quoteRequest}/create-company-with-subscription', [AdminQuoteRequestController::class, 'createCompanyWithSubscription'])->name('quote-requests.create-company-with-subscription');

        // Support
        Route::get('/support', [TicketController::class, 'index'])->name('tickets.index');
        Route::get('/support/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
        Route::post('/support/{ticket}/reply', [TicketController::class, 'reply'])->name('tickets.reply');
        Route::post('/support/{ticket}/close', [TicketController::class, 'close'])->name('tickets.close');
        Route::post('/support/{ticket}/assign', [TicketController::class, 'assign'])->name('tickets.assign');

        // Paramètres plateforme
        Route::get('/parametres', [AdminSettingsController::class, 'index'])->name('settings.index');
    });

require __DIR__ . '/auth.php';
