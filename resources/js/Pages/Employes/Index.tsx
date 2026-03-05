import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Department, PageProps, PaginatedData, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type Props = PageProps<{
    employees: PaginatedData<User>;
    departments: Department[];
    filters: { search?: string; department_id?: string; role?: string };
}>;

const roleLabels: Record<string, string> = {
    admin: 'Admin', manager: 'Manager', employee: 'Employé',
};

export default function EmployesIndex({ employees, departments, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [exportFormat, setExportFormat] = useState<'xlsx' | 'csv'>('xlsx');

    function buildExportUrl() {
        const params: Record<string, string> = { format: exportFormat };
        if (filters.search)        params.search        = filters.search;
        if (filters.department_id) params.department_id = filters.department_id;
        return route('employes.export') + '?' + new URLSearchParams(params).toString();
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(route('employes.index'), { search, department_id: filters.department_id }, { preserveState: true });
    }

    function handleDelete(id: number) {
        if (!confirm('Supprimer cet employé ?')) return;
        router.delete(route('employes.destroy', id));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Employés" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-white">Employés</h1>
                    <div className="flex items-center gap-3">
                        {/* Export */}
                        <div className="flex items-center gap-1">
                            <div className="flex rounded-lg border border-white/10 overflow-hidden">
                                {(['xlsx', 'csv'] as const).map(fmt => (
                                    <button
                                        key={fmt}
                                        onClick={() => setExportFormat(fmt)}
                                        className={`px-3 py-2 text-xs font-medium transition ${exportFormat === fmt ? 'bg-emerald-500 text-white' : 'bg-[#111827] text-gray-400 hover:bg-white/5'}`}
                                    >
                                        {fmt.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                            <a
                                href={buildExportUrl()}
                                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-400 hover:bg-white/5 hover:text-gray-200"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Exporter
                            </a>
                        </div>
                        <Link
                            href={route('employes.create')}
                            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
                        >
                            + Nouvel employé
                        </Link>
                    </div>
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-3">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button type="submit" className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/20">
                            Chercher
                        </button>
                    </form>

                    <select
                        onChange={e => router.get(route('employes.index'), { ...filters, department_id: e.target.value || undefined }, { preserveState: true })}
                        defaultValue={filters.department_id ?? ''}
                        className="rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                        <option value="">Tous les départements</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>

                {/* Tableau */}
                <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-left">
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Nom</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Département</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Rôle</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {employees.data.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-white/[0.02]">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400">
                                                    {emp.first_name[0]}{emp.last_name[0]}
                                                </div>
                                                <span className="text-sm font-medium text-gray-200">{emp.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{emp.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{emp.department?.name ?? '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                                                {roleLabels[emp.role] ?? emp.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${emp.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {emp.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <Link href={route('employes.presences', emp.id)} className="text-xs text-emerald-400 hover:text-emerald-300">Présences</Link>
                                                <Link href={route('employes.edit', emp.id)} className="text-xs text-gray-400 hover:text-gray-200">Modifier</Link>
                                                <button onClick={() => handleDelete(emp.id)} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {employees.data.length === 0 && (
                            <p className="p-8 text-center text-sm text-gray-500">Aucun employé trouvé.</p>
                        )}
                    </div>

                    {/* Pagination */}
                    {employees.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
                            <p className="text-sm text-gray-500">{employees.from}–{employees.to} sur {employees.total}</p>
                            <div className="flex gap-2">
                                {employees.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-white/10'} ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
