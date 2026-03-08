import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Department, Location, PageProps, User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

type Props = PageProps<{ employee: User; departments: Department[]; locations: Location[] }>;

export default function EmployeEdit({ employee, departments, locations }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        first_name:         employee.first_name,
        last_name:          employee.last_name,
        email:              employee.email,
        password:           '',
        phone:              employee.phone ?? '',
        role:               employee.role,
        department_id:      employee.department_id?.toString() ?? '',
        employee_id_number: employee.employee_id_number ?? '',
        location_id:        employee.location_id?.toString() ?? '',
        is_active:          employee.is_active,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('employes.update', employee.id));
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Modifier — ${employee.full_name}`} />

            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('employes.index')} className="text-gray-500 hover:text-secondary">← Retour</Link>
                    <h1 className="text-2xl font-bold text-primary">Modifier : {employee.full_name}</h1>
                </div>

                <form onSubmit={handleSubmit} className="rounded-xl border border-theme bg-surface p-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Prénom *</label>
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            {errors.first_name && <p className="mt-1 text-xs text-red-400">{errors.first_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Nom *</label>
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            {errors.last_name && <p className="mt-1 text-xs text-red-400">{errors.last_name}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Email *</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">
                            Nouveau mot de passe <span className="text-gray-600">(laisser vide pour ne pas changer)</span>
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Rôle *</label>
                            <select
                                value={data.role}
                                onChange={e => setData('role', e.target.value as any)}
                                className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="employee">Employé</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Département</label>
                            <select
                                value={data.department_id}
                                onChange={e => setData('department_id', e.target.value)}
                                className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="">— Aucun département —</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Téléphone</label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Zone de pointage assignée</label>
                            <select
                                value={data.location_id}
                                onChange={e => setData('location_id', e.target.value)}
                                className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="">— Toutes les zones —</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                            <p className="mt-1 text-xs text-gray-600">Si défini, l'employé ne pourra pointer que depuis cette zone.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Matricule</label>
                        <input
                            type="text"
                            value={data.employee_id_number}
                            onChange={e => setData('employee_id_number', e.target.value)}
                            className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-muted">Compte actif</label>
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={e => setData('is_active', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-600 bg-surface text-emerald-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-primary transition hover:bg-emerald-600 disabled:opacity-50"
                        >
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <Link href={route('employes.index')} className="rounded-lg border border-theme px-6 py-2 text-sm font-medium text-muted hover:bg-subtle">
                            Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
