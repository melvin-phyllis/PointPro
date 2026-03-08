import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Department, PageProps, PaginatedData, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Download, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';

type Props = PageProps<{
    employees: PaginatedData<User>;
    departments: Department[];
    filters: { search?: string; department_id?: string; role?: string };
}>;

const roleLabels: Record<string, string> = {
    admin: 'Admin', manager: 'Manager', employee: 'Employe',
};

export default function EmployesIndex({ employees, departments, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [exportFormat, setExportFormat] = useState<'xlsx' | 'csv'>('xlsx');
    const [empToDelete, setEmpToDelete] = useState<number | null>(null);

    function buildExportUrl() {
        const params: Record<string, string> = { format: exportFormat };
        if (filters.search) params.search = filters.search;
        if (filters.department_id) params.department_id = filters.department_id;
        return route('employes.export') + '?' + new URLSearchParams(params).toString();
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(route('employes.index'), { search, department_id: filters.department_id }, { preserveState: true });
    }

    function handleDelete() {
        if (empToDelete === null) return;
        router.delete(route('employes.destroy', empToDelete), {
            onSuccess: () => setEmpToDelete(null),
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Employes" />
            <div className="space-y-6 animate-fade-up">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
                            <Users size={20} className="text-brand-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-primary">Employes</h1>
                            <p className="text-sm text-secondary">{employees.total} au total</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-theme overflow-hidden">
                            {(['xlsx', 'csv'] as const).map(fmt => (
                                <button
                                    key={fmt}
                                    onClick={() => setExportFormat(fmt)}
                                    className={`px-3 py-2 text-xs font-medium transition ${exportFormat === fmt ? 'bg-brand-500 text-primary' : 'bg-surface text-secondary hover:bg-gray-100 dark:hover:bg-subtle'}`}
                                >
                                    {fmt.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <a
                            href={buildExportUrl()}
                            className="flex items-center gap-1.5 rounded-lg border border-theme bg-surface px-3 py-2 text-xs text-secondary hover:bg-gray-50 dark:hover:bg-subtle transition"
                        >
                            <Download size={14} />
                            Exporter
                        </a>
                        <Link
                            href={route('employes.create')}
                            className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-primary hover:bg-brand-600 transition shadow-sm"
                        >
                            <Plus size={16} />
                            Nouvel employe
                        </Link>
                    </div>
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-3">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-3 py-2 rounded-lg border border-theme bg-surface text-sm text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
                            />
                        </div>
                        <button type="submit" className="rounded-lg bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition">
                            Chercher
                        </button>
                    </form>

                    <select
                        onChange={e => router.get(route('employes.index'), { ...filters, department_id: e.target.value || undefined }, { preserveState: true })}
                        defaultValue={filters.department_id ?? ''}
                        className="rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
                    >
                        <option value="">Tous les departements</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-theme bg-surface overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-theme bg-gray-50 dark:bg-white/[0.02] text-left">
                                    {['Nom', 'Email', 'Departement', 'Role', 'Statut', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-secondary">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {employees.data.map(emp => (
                                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/10 text-xs font-bold text-brand-600 dark:text-brand-400 flex-shrink-0">
                                                    {emp.first_name[0]}{emp.last_name[0]}
                                                </div>
                                                <span className="text-sm font-semibold text-primary">{emp.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-secondary">{emp.email}</td>
                                        <td className="px-5 py-3.5 text-sm text-secondary">{emp.department?.name ?? '—'}</td>
                                        <td className="px-5 py-3.5">
                                            <span className="rounded-full bg-gray-100 dark:bg-subtle px-2.5 py-0.5 text-xs font-medium text-secondary">
                                                {roleLabels[emp.role] ?? emp.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${emp.is_active ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-500/20 text-gray-500 dark:text-muted'}`}>
                                                {emp.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex gap-3 text-xs font-medium">
                                                <Link href={route('employes.presences', emp.id)} className="text-brand-600 dark:text-brand-400 hover:underline">Presences</Link>
                                                <Link href={route('employes.edit', emp.id)} className="text-secondary hover:text-primary">Modifier</Link>
                                                <button onClick={() => setEmpToDelete(emp.id)} className="text-red-500 hover:text-red-600">Supprimer</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {employees.data.length === 0 && (
                            <div className="p-12 text-center">
                                <Users size={40} className="mx-auto mb-3 text-secondary dark:text-gray-600" />
                                <p className="text-sm text-secondary">Aucun employe trouve.</p>
                            </div>
                        )}
                    </div>

                    {employees.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-theme px-5 py-3">
                            <p className="text-sm text-secondary">{employees.from}–{employees.to} sur {employees.total}</p>
                            <div className="flex gap-1">
                                {employees.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`rounded-lg px-3 py-1.5 text-sm transition ${link.active ? 'bg-brand-500 text-primary' : 'text-secondary hover:bg-gray-100 dark:hover:bg-subtle'} ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                show={empToDelete !== null}
                onClose={() => setEmpToDelete(null)}
                onConfirm={handleDelete}
                title="Supprimer l'employé"
                description="Êtes-vous sûr de vouloir supprimer cet employé ? Toutes ses données de pointage seront également supprimées."
                confirmText="Supprimer"
            />
        </AuthenticatedLayout >
    );
}
