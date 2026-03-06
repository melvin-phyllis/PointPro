import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Company, PageProps, PaginatedData, Subscription, Plan } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type CompanyWithSub = Company & {
    users_count: number;
    current_subscription?: Subscription & { plan?: Plan };
};

type Props = PageProps<{
    companies: PaginatedData<CompanyWithSub>;
    filters: { search?: string; plan?: string; status?: string };
}>;

const planBadge: Record<string, string> = {
    starter:    'bg-gray-500/20 text-gray-400',
    business:   'bg-blue-500/20 text-blue-400',
    enterprise: 'bg-emerald-500/20 text-emerald-400',
    custom:     'bg-amber-500/20 text-amber-400',
};

export default function CompaniesIndex({ companies, filters }: Props) {
    const { data, setData, get } = useForm({ search: filters.search ?? '', plan: filters.plan ?? '', status: filters.status ?? '' });

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        get(route('admin.companies.index'), { preserveState: true });
    }

    function suspend(id: number) {
        if (confirm('Suspendre cette entreprise ?')) {
            router.post(route('admin.companies.suspend', id));
        }
    }

    function activate(id: number) {
        router.post(route('admin.companies.activate', id));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Entreprises" />
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-white">Entreprises</h1>
                        <p className="text-sm text-gray-400">{companies.total} entreprise(s) enregistrée(s)</p>
                    </div>
                    <Link href={route('admin.companies.create')}
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition">
                        + Ajouter une entreprise
                    </Link>
                </div>

                {/* Filtres */}
                <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
                    <input
                        type="text" placeholder="Rechercher..."
                        value={data.search} onChange={e => setData('search', e.target.value)}
                        className="flex-1 min-w-[200px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                    />
                    <select value={data.plan} onChange={e => setData('plan', e.target.value)}
                        className="rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                        <option value="">Tous les plans</option>
                        <option value="starter">Starter</option>
                        <option value="business">Business</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="custom">Custom</option>
                    </select>
                    <select value={data.status} onChange={e => setData('status', e.target.value)}
                        className="rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                        <option value="">Tous les statuts</option>
                        <option value="active">Actives</option>
                        <option value="inactive">Inactives</option>
                    </select>
                    <button type="submit" className="rounded-lg bg-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/20 transition">
                        Filtrer
                    </button>
                </form>

                {/* Tableau */}
                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0D1117]">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Entreprise</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Plan</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell">Employés</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">Abonnement</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {companies.data.length === 0 && (
                                <tr><td colSpan={6} className="py-10 text-center text-sm text-gray-500">Aucune entreprise trouvée</td></tr>
                            )}
                            {companies.data.map(c => (
                                <tr key={c.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-gray-200">{c.name}</p>
                                        <p className="text-xs text-gray-500">{c.email}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${planBadge[c.plan] ?? 'bg-gray-500/20 text-gray-400'}`}>
                                            {c.plan}
                                        </span>
                                    </td>
                                    <td className="hidden px-4 py-3 text-sm text-gray-400 sm:table-cell">{c.users_count}</td>
                                    <td className="hidden px-4 py-3 md:table-cell">
                                        {c.current_subscription ? (
                                            <p className="text-xs text-gray-400">
                                                {c.current_subscription.plan?.name} · expire {new Date(c.current_subscription.ends_at).toLocaleDateString('fr-FR')}
                                            </p>
                                        ) : (
                                            <span className="text-xs text-gray-600">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {c.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={route('admin.companies.show', c.id)} className="text-xs text-emerald-400 hover:underline">Voir</Link>
                                            {c.is_active
                                                ? <button onClick={() => suspend(c.id)} className="text-xs text-red-400 hover:underline">Suspendre</button>
                                                : <button onClick={() => activate(c.id)} className="text-xs text-emerald-400 hover:underline">Activer</button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {companies.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {companies.links.map((l, i) => (
                            l.url ? (
                                <Link key={i} href={l.url}
                                    className={`rounded px-3 py-1 text-sm transition ${l.active ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    dangerouslySetInnerHTML={{ __html: l.label }} />
                            ) : (
                                <span key={i} className="rounded px-3 py-1 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: l.label }} />
                            )
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
