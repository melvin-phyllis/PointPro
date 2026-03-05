<?php

namespace App\Http\Controllers;

use App\Exports\EmployeesExport;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Attendance;
use App\Models\Company;
use App\Models\Department;
use App\Models\Location;
use App\Models\User;
use App\Notifications\WelcomeEmployeeNotification;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class EmployeeController extends Controller
{
    /**
     * Liste des employés avec recherche et filtres.
     */
    public function index(Request $request): Response
    {
        $query = User::with('department:id,name')
            ->where('company_id', auth()->user()->company_id)
            ->where('role', '!=', 'super_admin')
            ->orderBy('last_name');

        // Recherche
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('employee_id_number', 'like', "%{$search}%");
            });
        }

        // Filtre par département
        if ($deptId = $request->input('department_id')) {
            $query->where('department_id', $deptId);
        }

        // Filtre par rôle
        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        // Filtre par statut
        if ($request->input('active') !== null) {
            $query->where('is_active', $request->boolean('active'));
        }

        $employees   = $query->paginate(20)->withQueryString();
        $departments = Department::select('id', 'name')->get();

        return Inertia::render('Employes/Index', [
            'employees'   => $employees,
            'departments' => $departments,
            'filters'     => $request->only(['search', 'department_id', 'role', 'active']),
        ]);
    }

    /**
     * Export de la liste des employés (CSV ou XLSX).
     */
    public function export(Request $request)
    {
        $request->validate([
            'format'        => 'required|in:csv,xlsx',
            'department_id' => 'nullable|integer',
        ]);

        $companyId = auth()->user()->company_id;
        $format    = $request->input('format');

        $query = User::with(['department:id,name', 'assignedLocation:id,name'])
            ->where('company_id', $companyId)
            ->where('role', '!=', 'super_admin')
            ->orderBy('last_name');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('employee_id_number', 'like', "%{$search}%");
            });
        }

        if ($deptId = $request->input('department_id')) {
            $query->where('department_id', $deptId);
        }

        $employees   = $query->get();
        $companyName = Company::find($companyId)?->name ?? 'PointPro';

        $rows = $employees->map(fn($u) => [
            'employee_id_number' => $u->employee_id_number ?? '',
            'last_name'          => $u->last_name,
            'first_name'         => $u->first_name,
            'email'              => $u->email,
            'phone'              => $u->phone ?? '',
            'department'         => $u->department?->name ?? '—',
            'role'               => match($u->role) {
                'admin'    => 'Admin',
                'manager'  => 'Manager',
                'employee' => 'Employé',
                default    => $u->role,
            },
            'location'           => $u->assignedLocation?->name ?? '—',
            'status'             => $u->is_active ? 'Actif' : 'Inactif',
        ]);

        $filename = 'employes_' . now()->format('Y-m-d');

        if ($format === 'xlsx') {
            return Excel::download(
                new EmployeesExport(collect($rows), $companyName),
                "{$filename}.xlsx"
            );
        }

        // CSV
        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}.csv\"",
        ];

        $callback = function () use ($rows, $companyName) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($file, [$companyName . ' — Liste des employés'], ';');
            fputcsv($file, ['Exporté le ' . now()->format('d/m/Y à H:i')], ';');
            fputcsv($file, [], ';');
            fputcsv($file, ['Matricule', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Département', 'Rôle', 'Zone GPS', 'Statut'], ';');

            foreach ($rows as $r) {
                fputcsv($file, [
                    $r['employee_id_number'], $r['last_name'], $r['first_name'],
                    $r['email'], $r['phone'], $r['department'],
                    $r['role'], $r['location'], $r['status'],
                ], ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Formulaire de création d'un employé.
     */
    public function create(): Response
    {
        $departments = Department::select('id', 'name')->get();
        $locations   = Location::select('id', 'name')->where('is_active', true)->get();

        return Inertia::render('Employes/Create', [
            'departments' => $departments,
            'locations'   => $locations,
        ]);
    }

    /**
     * Enregistrer un nouvel employé.
     * Le matricule et le mot de passe sont générés automatiquement.
     */
    public function store(StoreEmployeeRequest $request)
    {
        $data               = $request->validated();
        $companyId          = auth()->user()->company_id;
        $data['company_id'] = $companyId;

        // ── Auto-génération du matricule si non fourni ──────────
        if (empty($data['employee_id_number'])) {
            $prefix = $data['role'] === 'manager' ? 'MGR' : 'EMP';
            $count  = User::where('company_id', $companyId)
                ->where('role', $data['role'])
                ->count() + 1;
            $data['employee_id_number'] = $prefix . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
        }

        // ── Préfixe département (3 premières lettres, majuscules) ─
        $deptPrefix = 'PP';
        if (!empty($data['department_id'])) {
            $dept = Department::find($data['department_id']);
            if ($dept) {
                $deptPrefix = strtoupper(substr($dept->name, 0, 3));
            }
        }

        // ── Mot de passe = préfixe_dept + matricule ─────────────
        // Ex: département "Commercial", matricule "EMP-001" → "COMEMP-001"
        $plainPassword             = $deptPrefix . $data['employee_id_number'];
        $data['password']          = Hash::make($plainPassword);
        $data['email_verified_at'] = now(); // l'admin a validé l'email

        $employee = User::create($data);

        $emailSent = true;
        try {
            $employee->notify(new WelcomeEmployeeNotification(
                plainPassword: $plainPassword,
                companyName:   auth()->user()->company->name,
            ));
        } catch (\Exception $e) {
            $emailSent = false;
        }

        $message = $emailSent
            ? "Employé créé. Identifiants envoyés par email à {$employee->email}."
            : "Employé créé (matricule : {$employee->employee_id_number}, mdp : {$plainPassword}). L'envoi email a échoué, notifiez l'employé manuellement.";

        return redirect()->route('employes.index')->with('success', $message);
    }

    /**
     * Formulaire d'édition d'un employé.
     */
    public function edit(User $employe): Response
    {
        $departments = Department::select('id', 'name')->get();
        $locations   = Location::select('id', 'name')->where('is_active', true)->get();

        return Inertia::render('Employes/Edit', [
            'employee'    => $employe->load('department:id,name'),
            'departments' => $departments,
            'locations'   => $locations,
        ]);
    }

    /**
     * Mettre à jour un employé.
     */
    public function update(UpdateEmployeeRequest $request, User $employe)
    {
        $data = $request->validated();

        // Ne mettre à jour le mot de passe que s'il est fourni
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $employe->update($data);

        return redirect()->route('employes.index')
            ->with('success', 'Employé mis à jour avec succès.');
    }

    /**
     * Supprimer (soft delete) un employé.
     */
    public function destroy(User $employe)
    {
        // Empêcher la suppression de son propre compte
        if ($employe->id === auth()->id()) {
            return back()->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }

        $employe->delete();

        return redirect()->route('employes.index')
            ->with('success', 'Employé supprimé avec succès.');
    }

    /**
     * Export CSV de l'historique mensuel d'un employé.
     */
    public function presencesExport(Request $request, User $employe)
    {
        abort_if($employe->company_id !== auth()->user()->company_id, 403);

        $year  = (int) $request->input('year', date('Y'));
        $month = (int) $request->input('month', date('n'));

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate   = $startDate->copy()->endOfMonth();

        $attendances = Attendance::withoutGlobalScope('company')
            ->with('checkInLocation:id,name')
            ->where('user_id', $employe->id)
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $days = [];
        foreach (CarbonPeriod::create($startDate, $endDate) as $day) {
            $dateStr    = $day->toDateString();
            $attendance = $attendances->get($dateStr);
            $days[] = [
                'date'          => $dateStr,
                'day_label'     => $day->locale('fr')->isoFormat('ddd D MMM'),
                'check_in'      => $attendance?->check_in?->format('H:i') ?? '',
                'check_out'     => $attendance?->check_out?->format('H:i') ?? '',
                'worked_hours'  => $attendance?->worked_duration ?? '',
                'late_minutes'  => $attendance?->late_minutes ?? 0,
                'location_name' => $attendance?->checkInLocation?->name ?? '',
                'status'        => $attendance?->status ?? '',
            ];
        }

        $safeName = preg_replace('/[^a-z0-9_]/i', '_', $employe->full_name);
        $filename = "presences_{$safeName}_{$year}_{$month}.csv";

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($days, $employe, $year, $month) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($file, [
                'Employé'   => $employe->full_name,
                'Matricule' => $employe->employee_id_number ?? '',
                'Mois'      => $month . '/' . $year,
            ], ';');
            fputcsv($file, [], ';'); // ligne vide

            fputcsv($file, ['Date', 'Jour', 'Arrivée', 'Départ', 'Durée', 'Retard (min)', 'Zone', 'Statut'], ';');

            foreach ($days as $d) {
                fputcsv($file, [
                    $d['date'],
                    $d['day_label'],
                    $d['check_in'],
                    $d['check_out'],
                    $d['worked_hours'],
                    $d['late_minutes'],
                    $d['location_name'],
                    $d['status'],
                ], ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Historique de présence d'un employé (par mois).
     */
    public function presences(Request $request, User $employe): Response
    {
        // Sécurité : l'employé doit appartenir à la même company
        abort_if($employe->company_id !== auth()->user()->company_id, 403);

        $year  = (int) $request->input('year', date('Y'));
        $month = (int) $request->input('month', date('n'));

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate   = $startDate->copy()->endOfMonth();

        // Récupérer les pointages du mois
        $attendances = Attendance::withoutGlobalScope('company')
            ->with(['checkInLocation:id,name', 'checkOutLocation:id,name'])
            ->where('user_id', $employe->id)
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->orderBy('date')
            ->get()
            ->keyBy('date'); // indexé par date pour lookup rapide

        // Construire la liste jour par jour (tous les jours du mois)
        $days = [];
        foreach (CarbonPeriod::create($startDate, $endDate) as $day) {
            $dateStr    = $day->toDateString();
            $attendance = $attendances->get($dateStr);
            $days[] = [
                'date'          => $dateStr,
                'day_label'     => $day->locale('fr')->isoFormat('ddd D'),
                'is_weekend'    => $day->isWeekend(),
                'check_in'      => $attendance?->check_in?->format('H:i'),
                'check_out'     => $attendance?->check_out?->format('H:i'),
                'status'        => $attendance?->status,
                'late_minutes'  => $attendance?->late_minutes ?? 0,
                'worked_hours'  => $attendance?->worked_duration,
                'location_name' => $attendance?->checkInLocation?->name,
                'is_geo_verified' => $attendance?->is_geo_verified ?? false,
            ];
        }

        // Résumé du mois
        $all = $attendances->values();
        $summary = [
            'present'         => $all->whereIn('status', ['present', 'late'])->count(),
            'late'            => $all->where('status', 'late')->count(),
            'absent'          => $all->where('status', 'absent')->count(),
            'excused'         => $all->where('status', 'excused')->count(),
            'total_worked_h'  => round($all->sum('worked_hours'), 2),
            'total_overtime_h'=> round($all->sum('overtime_hours'), 2),
            'total_late_min'  => $all->sum('late_minutes'),
        ];

        return Inertia::render('Employes/Presences', [
            'employe'   => $employe->load('department:id,name'),
            'days'      => $days,
            'summary'   => $summary,
            'year'      => $year,
            'month'     => $month,
            'monthName' => $startDate->locale('fr')->isoFormat('MMMM YYYY'),
        ]);
    }
}
