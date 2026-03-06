<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Company;
use App\Models\Department;
use App\Models\Invoice;
use App\Models\Location;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\SupportTicket;
use App\Models\TicketMessage;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 0. Super Admin plateforme ───────────────────────────
        User::create([
            'company_id'        => null,
            'first_name'        => 'Super',
            'last_name'         => 'Admin',
            'email'             => 'super@pointpro.app',
            'password'          => Hash::make('password'),
            'role'              => 'super_admin',
            'is_active'         => true,
            'email_verified_at' => now(),
        ]);

        // ─── Données des entreprises de démo ────────────────────
        $companies = [
            [
                'name'    => 'SARL Tech Abidjan',
                'slug'    => 'sarl-tech-abidjan',
                'email'   => 'contact@techabidjan.ci',
                'phone'   => '+225 27 22 00 00 00',
                'address' => 'Plateau, Abidjan, Côte d\'Ivoire',
                'plan'    => 'business',
                'admin'   => ['email' => 'admin@techabidjan.ci', 'first' => 'Konan', 'last' => 'Admin'],
                'depts'   => ['Commercial', 'Comptabilité', 'Logistique', 'IT'],
                'managers' => [
                    ['Kouamé', 'Assi',    'Commercial'],
                    ['Fatou',  'Diabate', 'Comptabilité'],
                ],
                'employees' => [
                    ['Yao',      'Kouadio',   'Commercial'],
                    ['Akissi',   'Nguessan',  'Commercial'],
                    ['Ibrahim',  'Coulibaly', 'Comptabilité'],
                    ['Mariame',  'Toure',     'Comptabilité'],
                    ['Konan',    'Koffi',     'Logistique'],
                    ['Adjoua',   'Brou',      'Logistique'],
                    ['Seraphin', 'Yoboue',    'IT'],
                    ['Aya',      'Keita',     'IT'],
                ],
                'zones' => [
                    ['Bureau Plateau',    5.3364, -4.0267, 200],
                    ['Entrepôt Yopougon', 5.3345, -4.0285, 500],
                ],
            ],
            [
                'name'    => 'BTP Construire CI',
                'slug'    => 'btp-construire-ci',
                'email'   => 'rh@btpconstruire.ci',
                'phone'   => '+225 27 33 11 22 33',
                'address' => 'Cocody, Abidjan, Côte d\'Ivoire',
                'plan'    => 'enterprise',
                'admin'   => ['email' => 'admin@btpconstruire.ci', 'first' => 'Amos', 'last' => 'Tano'],
                'depts'   => ['Chantier', 'Administration', 'Finances'],
                'managers' => [
                    ['Eric',    'Bamba',   'Chantier'],
                    ['Sandrine','Ouattara','Administration'],
                ],
                'employees' => [
                    ['Adama',   'Kone',    'Chantier'],
                    ['Francois','Aka',     'Chantier'],
                    ['Aminata', 'Sylla',   'Administration'],
                    ['Bertin',  'Dion',    'Finances'],
                    ['Grace',   'Soro',    'Finances'],
                ],
                'zones' => [
                    ['Siège Cocody',   5.3600, -3.9800, 150],
                    ['Chantier Nord',  5.3800, -4.0100, 300],
                ],
            ],
            [
                'name'    => 'Micro Finance Ouest',
                'slug'    => 'micro-finance-ouest',
                'email'   => 'contact@mfo.ci',
                'phone'   => '+225 27 44 55 66 77',
                'address' => 'San Pédro, Côte d\'Ivoire',
                'plan'    => 'starter',
                'admin'   => ['email' => 'admin@mfo.ci', 'first' => 'Henriette', 'last' => 'Goba'],
                'depts'   => ['Guichet', 'Direction'],
                'managers' => [],
                'employees' => [
                    ['Luc',     'Ahoua',   'Guichet'],
                    ['Pierrette','Tra',     'Guichet'],
                    ['Marcel',  'Dago',    'Direction'],
                ],
                'zones' => [
                    ['Agence San Pédro', 4.7400, -6.6360, 100],
                ],
            ],
        ];

        foreach ($companies as $idx => $cfg) {
            $this->seedCompany($cfg, $idx);
        }

        // ─── Plans de démonstration ──────────────────────────────
        $planConfigs = [
            ['name' => 'Starter',    'slug' => 'starter',    'price' => 0,      'max_employees' => 5,    'max_locations' => 1, 'billing_cycle' => 'monthly', 'sort_order' => 1,
             'features' => ['basic_attendance' => true, 'geolocation' => false, 'multi_site' => false, 'reports' => false, 'export' => false, 'api_access' => false, 'priority_support' => false, 'sso' => false]],
            ['name' => 'Business',   'slug' => 'business',   'price' => 25000,  'max_employees' => 50,   'max_locations' => 3, 'billing_cycle' => 'monthly', 'sort_order' => 2,
             'features' => ['basic_attendance' => true, 'geolocation' => true,  'multi_site' => true,  'reports' => true,  'export' => true,  'api_access' => false, 'priority_support' => false, 'sso' => false]],
            ['name' => 'Enterprise', 'slug' => 'enterprise', 'price' => 75000,  'max_employees' => null,  'max_locations' => 10, 'billing_cycle' => 'monthly', 'sort_order' => 3,
             'features' => ['basic_attendance' => true, 'geolocation' => true,  'multi_site' => true,  'reports' => true,  'export' => true,  'api_access' => true,  'priority_support' => true,  'sso' => false]],
            ['name' => 'Custom',     'slug' => 'custom',     'price' => 150000, 'max_employees' => null,  'max_locations' => 99, 'billing_cycle' => 'yearly',  'sort_order' => 4,
             'features' => ['basic_attendance' => true, 'geolocation' => true,  'multi_site' => true,  'reports' => true,  'export' => true,  'api_access' => true,  'priority_support' => true,  'sso' => true]],
        ];

        $plans = [];
        foreach ($planConfigs as $pc) {
            $plans[$pc['slug']] = Plan::create(array_merge($pc, ['currency' => 'XOF', 'is_active' => true]));
        }

        // ─── Subscriptions, Payments, Invoices, Tickets ────────
        $allCompanies = Company::all();
        $superAdmin = User::where('role', 'super_admin')->first();
        $paymentMethods = ['mobile_money', 'wave', 'bank_transfer', 'cash'];
        $ticketSubjects = [
            'Impossible de pointer depuis l\'application mobile',
            'Problème de géolocalisation sur certains sites',
            'Demande de facturation détaillée',
            'Comment ajouter un nouveau département ?',
        ];

        foreach ($allCompanies as $company) {
            $plan = $plans[$company->plan] ?? $plans['starter'];

            // Subscription
            $sub = Subscription::create([
                'company_id' => $company->id,
                'plan_id'    => $plan->id,
                'status'     => 'active',
                'starts_at'  => now()->subMonths(2),
                'ends_at'    => now()->addMonths(10),
            ]);

            // 2-3 paiements par entreprise
            $nbPayments = rand(2, 3);
            for ($p = 0; $p < $nbPayments; $p++) {
                $payment = Payment::create([
                    'company_id'      => $company->id,
                    'subscription_id' => $sub->id,
                    'amount'          => $plan->price,
                    'currency'        => 'XOF',
                    'payment_method'  => $paymentMethods[array_rand($paymentMethods)],
                    'status'          => 'completed',
                    'paid_at'         => now()->subMonths($nbPayments - $p)->subDays(rand(0, 10)),
                ]);

                // Facture associée
                Invoice::create([
                    'company_id'      => $company->id,
                    'payment_id'      => $payment->id,
                    'invoice_number'  => 'FAC-' . date('Ym') . '-' . str_pad($company->id . $p, 4, '0', STR_PAD_LEFT),
                    'amount'          => $plan->price,
                    'currency'        => 'XOF',
                    'tax_amount'      => 0,
                    'total_amount'    => $plan->price,
                    'description'     => "Abonnement {$plan->name}",
                    'status'          => 'paid',
                    'due_date'        => $payment->paid_at,
                    'paid_at'         => $payment->paid_at,
                    'billing_details' => ['company' => $company->name, 'email' => $company->email],
                ]);
            }

            // 1 ticket de support
            $admin = $company->users()->where('role', 'admin')->first();
            if ($admin) {
                $ticket = SupportTicket::create([
                    'company_id'    => $company->id,
                    'user_id'       => $admin->id,
                    'ticket_number' => 'TK-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                    'subject'       => $ticketSubjects[array_rand($ticketSubjects)],
                    'category'      => ['bug', 'billing', 'feature_request', 'general'][array_rand(['bug', 'billing', 'feature_request', 'general'])],
                    'priority'      => ['low', 'medium', 'high'][array_rand(['low', 'medium', 'high'])],
                    'status'        => 'open',
                ]);

                TicketMessage::create([
                    'ticket_id' => $ticket->id,
                    'user_id'   => $admin->id,
                    'body'      => 'Bonjour, nous rencontrons un problème. Merci de nous aider.',
                    'is_internal_note' => false,
                ]);

                if ($superAdmin) {
                    TicketMessage::create([
                        'ticket_id' => $ticket->id,
                        'user_id'   => $superAdmin->id,
                        'body'      => 'Bonjour, merci pour votre message. Nous examinons le problème et reviendrons vers vous rapidement.',
                        'is_internal_note' => false,
                    ]);

                    $ticket->update(['status' => 'in_progress']);
                }
            }
        }

        $this->command->info('');
        $this->command->info('✅  Données de démonstration créées !');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('🔑  Super Admin  : super@pointpro.app  / password');
        $this->command->info('🔑  Admin (demo) : admin@techabidjan.ci / password');
        $this->command->info('🔑  Admin BTP    : admin@btpconstruire.ci / password');
        $this->command->info('🔑  Admin MFO    : admin@mfo.ci / password');
        $this->command->info('🏢  3 entreprises créées (business / enterprise / starter)');
        $this->command->info('📋  4 plans · 3 abonnements · ~8 paiements · 3 tickets');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    private function seedCompany(array $cfg, int $companyIndex): void
    {
        $company = Company::create([
            'name'      => $cfg['name'],
            'slug'      => $cfg['slug'],
            'email'     => $cfg['email'],
            'phone'     => $cfg['phone'],
            'address'   => $cfg['address'],
            'plan'      => $cfg['plan'],
            'is_active' => true,
            'settings'  => [
                'work_start'                => '08:00',
                'work_end'                  => '17:00',
                'late_tolerance_minutes'    => 15,
                'early_check_in_minutes'    => 30,
                'auto_absent_after_minutes' => 120,
                'lunch_break_minutes'       => 60,
                'timezone'                  => 'Africa/Abidjan',
            ],
        ]);

        // Décaler les dates de création pour la courbe de croissance
        $company->created_at = now()->subMonths(5 - $companyIndex)->subDays(rand(0, 20));
        $company->save();

        // Départements
        $depts = [];
        foreach ($cfg['depts'] as $deptName) {
            $depts[$deptName] = Department::create([
                'company_id' => $company->id,
                'name'       => $deptName,
            ]);
        }

        // Admin
        $adminCfg = $cfg['admin'];
        User::create([
            'company_id'         => $company->id,
            'department_id'      => $depts[array_key_first($depts)]->id,
            'first_name'         => $adminCfg['first'],
            'last_name'          => $adminCfg['last'],
            'email'              => $adminCfg['email'],
            'password'           => Hash::make('password'),
            'role'               => 'admin',
            'employee_id_number' => 'ADM-001',
            'is_active'          => true,
            'email_verified_at'  => now(),
        ]);

        // Managers
        $managers = [];
        foreach ($cfg['managers'] as $i => [$first, $last, $dept]) {
            $mgr = User::create([
                'company_id'         => $company->id,
                'department_id'      => $depts[$dept]->id,
                'first_name'         => $first,
                'last_name'          => $last,
                'email'              => strtolower($first . '.' . $last) . '@' . $this->domain($cfg['email']),
                'password'           => Hash::make('password'),
                'role'               => 'manager',
                'employee_id_number' => 'MGR-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                'is_active'          => true,
                'email_verified_at'  => now(),
            ]);
            $managers[] = $mgr;
            $depts[$dept]->update(['manager_id' => $mgr->id]);
        }

        // Employés
        $employees = [];
        foreach ($cfg['employees'] as $i => [$first, $last, $dept]) {
            $employees[] = User::create([
                'company_id'         => $company->id,
                'department_id'      => $depts[$dept]->id,
                'first_name'         => $first,
                'last_name'          => $last,
                'email'              => strtolower($first . '.' . $last) . '@' . $this->domain($cfg['email']),
                'password'           => Hash::make('password'),
                'role'               => 'employee',
                'employee_id_number' => 'EMP-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                'is_active'          => true,
                'email_verified_at'  => now(),
            ]);
        }

        // Zones GPS
        $locations = [];
        foreach ($cfg['zones'] as [$zoneName, $lat, $lng, $radius]) {
            $locations[] = Location::create([
                'company_id'    => $company->id,
                'name'          => $zoneName,
                'address'       => $zoneName,
                'latitude'      => $lat,
                'longitude'     => $lng,
                'radius_meters' => $radius,
                'is_active'     => true,
            ]);
        }

        // Attendances (30 derniers jours ouvrables)
        $allUsers = collect($employees)->merge($managers);
        if ($allUsers->isEmpty()) return;

        $weighted = ['present','present','present','present','present','late','late','absent'];

        for ($daysAgo = 29; $daysAgo >= 0; $daysAgo--) {
            $date = Carbon::today()->subDays($daysAgo);
            if ($date->isWeekend()) continue;

            foreach ($allUsers as $user) {
                $status   = $weighted[array_rand($weighted)];
                $location = $locations[array_rand($locations)];
                $checkIn  = $checkOut = null;
                $lateMin  = 0;
                $workedH  = null;

                if ($status !== 'absent') {
                    $checkIn = $status === 'present'
                        ? $date->copy()->setTime(7, 45 + rand(0, 25), 0)
                        : $date->copy()->setTime(8, 20 + rand(0, 50), 0);

                    $lateMin  = $status === 'late'
                        ? max(0, (int) $checkIn->diffInMinutes($date->copy()->setTime(8, 15, 0)))
                        : 0;

                    $checkOut = $date->copy()->setTime(17, rand(0, 30), 0);
                    $totalMin = $checkIn->diffInMinutes($checkOut);
                    $workedH  = round(max(0, ($totalMin - 60) / 60), 2);
                }

                Attendance::create([
                    'user_id'               => $user->id,
                    'company_id'            => $company->id,
                    'date'                  => $date->toDateString(),
                    'check_in'              => $checkIn,
                    'check_out'             => $checkOut,
                    'check_in_latitude'     => $checkIn  ? $location->latitude  + (rand(-5, 5) / 10000) : null,
                    'check_in_longitude'    => $checkIn  ? $location->longitude + (rand(-5, 5) / 10000) : null,
                    'check_out_latitude'    => $checkOut ? $location->latitude  + (rand(-5, 5) / 10000) : null,
                    'check_out_longitude'   => $checkOut ? $location->longitude + (rand(-5, 5) / 10000) : null,
                    'check_in_location_id'  => $checkIn  ? $location->id : null,
                    'check_out_location_id' => $checkOut ? $location->id : null,
                    'status'                => $status,
                    'late_minutes'          => $lateMin,
                    'worked_hours'          => $workedH,
                    'overtime_hours'        => ($workedH && $workedH > 8) ? round($workedH - 8, 2) : 0,
                    'is_geo_verified'       => (bool) $checkIn,
                ]);
            }
        }
    }

    private function domain(string $email): string
    {
        return substr($email, strpos($email, '@') + 1);
    }
}
