import ConfirmModal from '@/Components/ConfirmModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Company, PageProps, PaginatedData, Subscription, Plan } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type CompanyWithSub = Company & {
    users_count: number;
    current_subscription?: Subscription & { plan?: Plan };
};

type Props = PageProps<{
    companies: PaginatedData<CompanyWithSub>;
    filters: { search?: string; plan?: string; status?: string; with_deleted?: string };
}>;

const planBadge: Record<string, string> = {
    starter:    'bg-gray-500/20 text-muted',
    business:   'bg-blue-500/20 text-blue-400',
    enterprise: 'bg-emerald-500/20 text-emerald-400',
    custom:     'bg-amber-500/20 text-amber-400',
};

const planLabel: Record<string, string> = {
    starter: 'Starter',
    business: 'Business',
    enterprise: 'Enterprise',
    custom: 'Custom',
};

export default function CompaniesIndex({ companies, filters }: Props) {
    const { data, setData, get } = useForm({
        search: filters.search ?? '',
        plan: filters.plan ?? '',
        status: filters.status ?? '',
        with_deleted: filters.with_deleted === '1' || filters.with_deleted === 'true',
    });
    const [suspendTarget, setSuspendTarget] = useState<CompanyWithSub | null>(null);
    const [activateTarget, setActivateTarget] = useState<CompanyWithSub | null>(null);

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams();
        if (data.search) params.set('search', data.search);
        if (data.plan) params.set('plan', data.plan);
        if (data.status) params.set('status', data.status);
        if (data.with_deleted) params.set('with_deleted', '1');
        const url = route('admin.companies.index') + (params.toString() ? '?' + params.toString() : '');
        get(url, { preserveState: true });
    }

    function doSuspend() {
        if (suspendTarget) {
            router.post(route('admin.companies.suspend', suspendTarget.id), {}, { onSuccess: () => setSuspendTarget(null) });
        }
    }

    function doActivate() {
        if (activateTarget) {
            router.post(route('admin.companies.activate', activateTarget.id), {}, { onSuccess: () => setActivateTarget(null) });
        }
    }

    function isDemo(c: CompanyWithSub): boolean {
        return !!c.trial_ends_at && new Date(c.trial_ends_at) > new Date();
    }

    return (
        <AuthenticatedLayout>
            <Head title="Entreprises" />
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-primary">Entreprises</h1>
                        <p className="text-sm text-muted">{companies.total} entreprise(s) enregistrée(s)</p>
                    </div>
                    <Link href={route('admin.companies.create')}
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-primary hover:bg-emerald-600 transition">
                        + Ajouter une entreprise
                    </Link>
                </div>

                {/* Filtres */}
                <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
                    <input
                        type="text" placeholder="Rechercher..."
                        value={data.search} onChange={e => setData('search', e.target.value)}
                        className="flex-1 min-w-[200px] rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                    />
                    <select value={data.plan} onChange={e => setData('plan', e.target.value)}
                        className="rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none">
                        <option value="">Tous les plans</option>
                        <option value="starter">Starter</option>
                        <option value="business">Business</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="custom">Custom</option>
                    </select>
                    <select value={data.status} onChange={e => setData('status', e.target.value)}
                        className="rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none">
                        <option value="">Tous les statuts</option>
                        <option value="active">Actives</option>
                        <option value="inactive">Inactives</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.with_deleted}
                            onChange={e => setData('with_deleted', e.target.checked)}
                            className="rounded border-theme"
                        />
                        Inclure les supprimées
                    </label>
                    <button type="submit" className="rounded-lg bg-subtle px-4 py-2 text-sm text-primary hover:bg-white/20 transition">
                        Filtrer
                    </button>
                </form>

                {/* Tableau */}
                <div className="overflow-hidden rounded-xl border border-theme bg-surface">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-theme">
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Entreprise</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Plan</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell">Employés</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">Abonnement</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:table-cell">Créée le</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {companies.data.length === 0 && (
                                <tr><td colSpan={7} className="py-10 text-center text-sm text-gray-500">Aucune entreprise trouvée</td></tr>
                            )}
                            {companies.data.map(c => {
                                const deleted = !!c.deleted_at;
                                return (
                                <tr key={c.id} className={`hover:bg-white/[0.02] ${deleted ? 'opacity-60' : ''}`}>
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-primary">{c.name}</p>
                                        <p className="text-xs text-gray-500">{c.email}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${planBadge[c.plan] ?? 'bg-gray-500/20 text-muted'}`}>
                                            {planLabel[c.plan] ?? c.plan}
                                        </span>
                                        {isDemo(c) && (
                                            <span className="ml-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-500">Démo</span>
                                        )}
                                    </td>
                                    <td className="hidden px-4 py-3 text-sm text-muted sm:table-cell">{c.users_count}</td>
                                    <td className="hidden px-4 py-3 md:table-cell">
                                        {c.current_subscription ? (
                                            <p className="text-xs text-muted">
                                                {c.current_subscription.plan?.name} · expire {new Date(c.current_subscription.ends_at).toLocaleDateString('fr-FR')}
                                            </p>
                                        ) : isDemo(c) && c.trial_ends_at ? (
                                            <p className="text-xs text-amber-600 dark:text-amber-400">Démo jusqu'au {new Date(c.trial_ends_at).toLocaleDateString('fr-FR')}</p>
                                        ) : (
                                            <span className="text-xs text-gray-600">—</span>
                                        )}
                                    </td>
                                    <td className="hidden px-4 py-3 text-xs text-muted lg:table-cell">
                                        {c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR') : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {deleted ? (
                                                <span className="rounded-full bg-gray-500/20 px-2 py-0.5 text-xs text-muted">Supprimée</span>
                                            ) : (
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                    {c.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!deleted && (
                                                <Link href={route('admin.companies.show', c.id)} className="text-xs text-emerald-400 hover:underline">Voir</Link>
                                            )}
                                            {!deleted && c.is_active && (
                                                <button onClick={() => setSuspendTarget(c)} className="text-xs text-red-400 hover:underline">Suspendre</button>
                                            )}
                                            {!deleted && !c.is_active && (
                                                <button onClick={() => setActivateTarget(c)} className="text-xs text-emerald-400 hover:underline">Activer</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );})}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {companies.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {companies.links.map((l, i) => (
                            l.url ? (
                                <Link key={i} href={l.url}
                                    className={`rounded px-3 py-1 text-sm transition ${l.active ? 'bg-emerald-500 text-primary' : 'bg-subtle text-muted hover:bg-subtle'}`}
                                    dangerouslySetInnerHTML={{ __html: l.label }} />
                            ) : (
                                <span key={i} className="rounded px-3 py-1 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: l.label }} />
                            )
                        ))}
                    </div>
                )}

                <ConfirmModal
                    show={!!suspendTarget}
                    onClose={() => setSuspendTarget(null)}
                    onConfirm={doSuspend}
                    title="Suspendre l'entreprise"
                    description={suspendTarget ? `Voulez-vous suspendre « ${suspendTarget.name} » ? Les utilisateurs ne pourront plus accéder à l'application.` : ''}
                    confirmText="Suspendre"
                    variant="danger"
                />
                <ConfirmModal
                    show={!!activateTarget}
                    onClose={() => setActivateTarget(null)}
                    onConfirm={doActivate}
                    title="Activer l'entreprise"
                    description={activateTarget ? `Voulez-vous réactiver « ${activateTarget.name} » ?` : ''}
                    confirmText="Activer"
                    variant="primary"
                />
            </div>
        </AuthenticatedLayout>
    );
}
