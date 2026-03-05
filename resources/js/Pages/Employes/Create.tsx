import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Department, Location, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

type Props = PageProps<{ departments: Department[]; locations: Location[] }>;

export default function EmployeCreate({ departments, locations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        first_name:    '',
        last_name:     '',
        email:         '',
        phone:         '',
        role:          'employee' as 'employee' | 'manager',
        department_id: '',
        location_id:   '',
    });

    // Prévisualisation du mot de passe auto-généré
    const deptName    = departments.find(d => String(d.id) === String(data.department_id))?.name ?? '';
    const deptPrefix  = deptName ? deptName.substring(0, 3).toUpperCase() : 'PP';
    const rolePrefix  = data.role === 'manager' ? 'MGR' : 'EMP';
    const previewPass = `${deptPrefix}${rolePrefix}-XXX`;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('employes.store'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Nouvel employé" />

            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('employes.index')} className="text-gray-500 hover:text-gray-300">← Retour</Link>
                    <h1 className="text-2xl font-bold text-white">Nouvel employé</h1>
                </div>

                {/* Info mot de passe auto */}
                <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm">
                    <span className="mt-0.5 text-emerald-400">🔐</span>
                    <div>
                        <p className="font-medium text-emerald-400">Mot de passe généré automatiquement</p>
                        <p className="mt-0.5 text-gray-400">
                            Format : <span className="font-mono text-white">3 lettres du département + matricule</span>
                        </p>
                        <p className="mt-1 text-gray-500">
                            Aperçu : <span className="font-mono font-bold text-white">{previewPass}</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-600">L'employé recevra ses identifiants par email dès la création.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-[#111827] p-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Prénom *</label>
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            {errors.first_name && <p className="mt-1 text-xs text-red-400">{errors.first_name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Nom *</label>
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            {errors.last_name && <p className="mt-1 text-xs text-red-400">{errors.last_name}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email *</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Rôle *</label>
                            <select
                                value={data.role}
                                onChange={e => setData('role', e.target.value as 'employee' | 'manager')}
                                className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="employee">Employé</option>
                                <option value="manager">Manager</option>
                            </select>
                            {errors.role && <p className="mt-1 text-xs text-red-400">{errors.role}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Département</label>
                            <select
                                value={data.department_id}
                                onChange={e => setData('department_id', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="">— Aucun département —</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Téléphone</label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Zone de pointage assignée</label>
                            <select
                                value={data.location_id}
                                onChange={e => setData('location_id', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="">— Toutes les zones —</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                            <p className="mt-1 text-xs text-gray-600">Si défini, l'employé ne pourra pointer que depuis cette zone.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
                        >
                            {processing ? 'Création...' : 'Créer et envoyer les identifiants'}
                        </button>
                        <Link href={route('employes.index')} className="rounded-lg border border-white/10 px-6 py-2 text-sm font-medium text-gray-400 hover:bg-white/5">
                            Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
