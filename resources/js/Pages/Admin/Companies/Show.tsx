import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Company, PageProps, Payment, SupportTicket, Subscription, Plan } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type CompanyFull = Company & {
    users: { id: number; full_name: string; role: string; email: string; department?: { name: string } }[];
    departments: { id: number; name: string }[];
    locations: { id: number; name: string }[];
    current_subscription?: Subscription & { plan?: Plan };
    users_count: number; attendances_count: number; locations_count: number; departments_count: number;
};

type Props = PageProps<{
    company: CompanyFull;
    payments: (Payment & { subscription?: Subscription & { plan?: Plan } })[];
    tickets: SupportTicket[];
}>;

const planBadge: Record<string, string> = {
    starter: 'bg-gray-500/20 text-muted', business: 'bg-blue-500/20 text-blue-400',
    enterprise: 'bg-emerald-500/20 text-emerald-400', custom: 'bg-amber-500/20 text-amber-400',
};
const paymentStatus: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-400', pending: 'bg-amber-500/20 text-amber-400',
    failed: 'bg-red-500/20 text-red-400', cancelled: 'bg-gray-500/20 text-muted',
};
const priorityBadge: Record<string, string> = {
    low: 'bg-gray-500/20 text-muted', medium: 'bg-blue-500/20 text-blue-400',
    high: 'bg-amber-500/20 text-amber-400', urgent: 'bg-red-500/20 text-red-400',
};

export default function CompanyShow({ company, payments, tickets }: Props) {
    const [tab, setTab] = useState<'info' | 'employees' | 'payments' | 'tickets'>('info');

    function suspend() {
        if (confirm('Suspendre cette entreprise ?')) router.post(route('admin.companies.suspend', company.id));
    }
    function activate() { router.post(route('admin.companies.activate', company.id)); }

    return (
        <AuthenticatedLayout>
            <Head title={company.name} />
            <div className="space-y-6">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href={route('admin.companies.index')} className="hover:text-emerald-400">Entreprises</Link>
                    <span>/</span>
                    <span className="text-primary">{company.name}</span>
                </div>

                {/* Header card */}
                <div className="rounded-xl border border-theme bg-surface p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-lg font-bold text-emerald-400">
                                    {company.name[0]}
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-primary">{company.name}</h1>
                                    <p className="text-sm text-muted">{company.email}</p>
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${planBadge[company.plan]}`}>{company.plan}</span>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${company.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {company.is_active ? 'Active' : 'Suspendue'}
                                </span>
                                {company.current_subscription && (
                                    <span className="rounded-full bg-subtle px-2.5 py-0.5 text-xs text-muted">
                                        Expire le {new Date(company.current_subscription.ends_at).toLocaleDateString('fr-FR')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions rapides */}
                        <div className="flex flex-wrap gap-2">
                            <Link href={`${route('admin.payments.create')}?company_id=${company.id}`}
                                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-primary hover:bg-emerald-600 transition">
                                + Paiement
                            </Link>
                            {company.is_active
                                ? <button onClick={suspend} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition">Suspendre</button>
                                : <button onClick={activate} className="rounded-lg border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition">Activer</button>
                            }
                        </div>
                    </div>

                    {/* Stats rapides */}
                    <div className="mt-4 grid grid-cols-4 gap-3">
                        {[
                            { label: 'Employés', value: company.users_count },
                            { label: 'Départements', value: company.departments_count },
                            { label: 'Zones GPS', value: company.locations_count },
                            { label: 'Pointages', value: company.attendances_count },
                        ].map(s => (
                            <div key={s.label} className="rounded-lg bg-subtle p-3 text-center">
                                <p className="text-lg font-bold text-primary">{s.value}</p>
                                <p className="text-xs text-gray-500">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Onglets */}
                <div className="flex gap-1 rounded-xl border border-theme bg-surface p-1">
                    {(['info', 'employees', 'payments', 'tickets'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${tab === t ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-primary'}`}>
                            {t === 'info' ? 'Informations' : t === 'employees' ? 'Employés' : t === 'payments' ? 'Paiements' : 'Support'}
                        </button>
                    ))}
                </div>

                {/* Contenu des onglets */}
                {tab === 'info' && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-theme bg-surface p-5 space-y-3">
                            <h3 className="text-sm font-semibold text-primary">Informations</h3>
                            {[['Email', company.email], ['Téléphone', company.phone ?? '—'], ['Adresse', company.address ?? '—']].map(([l, v]) => (
                                <div key={l}><p className="text-xs text-gray-500">{l}</p><p className="text-sm text-primary">{v}</p></div>
                            ))}
                        </div>
                        <div className="rounded-xl border border-theme bg-surface p-5 space-y-3">
                            <h3 className="text-sm font-semibold text-primary">Abonnement actuel</h3>
                            {company.current_subscription ? (
                                <>
                                    <div><p className="text-xs text-gray-500">Plan</p><p className="text-sm text-primary">{company.current_subscription.plan?.name}</p></div>
                                    <div><p className="text-xs text-gray-500">Début</p><p className="text-sm text-primary">{new Date(company.current_subscription.starts_at).toLocaleDateString('fr-FR')}</p></div>
                                    <div><p className="text-xs text-gray-500">Fin</p><p className="text-sm text-primary">{new Date(company.current_subscription.ends_at).toLocaleDateString('fr-FR')}</p></div>
                                    <div><p className="text-xs text-gray-500">Statut</p><span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">Actif</span></div>
                                </>
                            ) : <p className="text-sm text-gray-500">Aucun abonnement actif</p>}
                        </div>
                    </div>
                )}

                {tab === 'employees' && (
                    <div className="overflow-hidden rounded-xl border border-theme bg-surface">
                        <table className="w-full">
                            <thead><tr className="border-b border-theme">
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nom</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Rôle</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell">Département</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                {company.users.map(u => (
                                    <tr key={u.id} className="hover:bg-white/[0.02]">
                                        <td className="px-4 py-3"><p className="text-sm text-primary">{u.full_name}</p><p className="text-xs text-gray-500">{u.email}</p></td>
                                        <td className="px-4 py-3"><span className="rounded bg-subtle px-2 py-0.5 text-xs text-secondary">{u.role}</span></td>
                                        <td className="hidden px-4 py-3 text-sm text-muted sm:table-cell">{u.department?.name ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'payments' && (
                    <div className="space-y-3">
                        {payments.length === 0 && <p className="text-center text-sm text-gray-500 py-8">Aucun paiement</p>}
                        {payments.map(p => (
                            <div key={p.id} className="flex items-center justify-between rounded-xl border border-theme bg-surface px-4 py-3">
                                <div>
                                    <p className="text-sm font-medium text-primary">{p.subscription?.plan?.name ?? p.payment_method}</p>
                                    <p className="text-xs text-gray-500">{p.paid_at ? new Date(p.paid_at).toLocaleDateString('fr-FR') : '—'} · {p.payment_method}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-emerald-400">{new Intl.NumberFormat('fr-FR').format(p.amount)} FCFA</span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs ${paymentStatus[p.status] ?? 'bg-gray-500/20 text-muted'}`}>{p.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'tickets' && (
                    <div className="space-y-3">
                        {tickets.length === 0 && <p className="text-center text-sm text-gray-500 py-8">Aucun ticket</p>}
                        {tickets.map(t => (
                            <Link key={t.id} href={route('admin.tickets.show', t.id)}
                                className="flex items-center justify-between rounded-xl border border-theme bg-surface px-4 py-3 hover:bg-subtle transition">
                                <div>
                                    <p className="text-sm font-medium text-primary">{t.subject}</p>
                                    <p className="text-xs text-gray-500">{t.ticket_number} · {new Date(t.created_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <span className={`rounded-full px-2 py-0.5 text-xs ${priorityBadge[t.priority]}`}>{t.priority}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
