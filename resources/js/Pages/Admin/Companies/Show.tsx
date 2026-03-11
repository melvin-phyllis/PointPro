import ConfirmModal from '@/Components/ConfirmModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Company, PageProps, Payment, SupportTicket, Subscription, Plan } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';

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
    plans: Plan[];
}>;

const planBadge: Record<string, string> = {
    starter: 'bg-gray-500/20 text-muted', business: 'bg-blue-500/20 text-blue-400',
    enterprise: 'bg-emerald-500/20 text-emerald-400', custom: 'bg-amber-500/20 text-amber-400',
};
const planLabel: Record<string, string> = {
    starter: 'Starter', business: 'Business', enterprise: 'Enterprise', custom: 'Custom',
};
const paymentStatus: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-400', pending: 'bg-amber-500/20 text-amber-400',
    failed: 'bg-red-500/20 text-red-400', cancelled: 'bg-gray-500/20 text-muted',
};
const priorityBadge: Record<string, string> = {
    low: 'bg-gray-500/20 text-muted', medium: 'bg-blue-500/20 text-blue-400',
    high: 'bg-amber-500/20 text-amber-400', urgent: 'bg-red-500/20 text-red-400',
};

const DURATION_OPTIONS = [
    { value: '1_month', label: '1 mois' },
    { value: '3_months', label: '3 mois' },
    { value: '1_year', label: '1 an' },
] as const;

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    mobile_money: 'Mobile Money',
    bank_transfer: 'Virement',
    cash: 'Espèces',
    wave: 'Wave',
    other: 'Autre',
};

function fmt(n: number) {
    return new Intl.NumberFormat('fr-FR').format(n);
}

export default function CompanyShow({ company, payments, tickets, plans = [] }: Props) {
    const [tab, setTab] = useState<'info' | 'employees' | 'payments' | 'tickets'>('info');
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showActivateModal, setShowActivateModal] = useState(false);

    const subscriptionForm = useForm({
        plan_id: '' as number | '',
        duration: '1_month' as '1_month' | '3_months' | '1_year',
        amount: 0,
        payment_method: 'bank_transfer' as string,
        notes: '',
    });

    const editForm = useForm({
        name: company.name,
        email: company.email,
        phone: company.phone ?? '',
        address: company.address ?? '',
    });

    const selectedPlan = plans.find(p => p.id === Number(subscriptionForm.data.plan_id));

    const isOnTrial = !!company.trial_ends_at && new Date(company.trial_ends_at) > new Date();
    const trialExpiresSoon = company.trial_ends_at && (new Date(company.trial_ends_at).getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000;

    function submitSubscription(e: FormEvent) {
        e.preventDefault();
        subscriptionForm.post(route('admin.companies.subscription.store', company.id), {
            onSuccess: () => {
                setShowSubscriptionModal(false);
                subscriptionForm.reset();
            },
        });
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();
        editForm.put(route('admin.companies.update', company.id), {
            onSuccess: () => setShowEditModal(false),
        });
    }

    function doSuspend() {
        router.post(route('admin.companies.suspend', company.id), {}, { onSuccess: () => setShowSuspendModal(false) });
    }
    function doActivate() {
        router.post(route('admin.companies.activate', company.id), {}, { onSuccess: () => setShowActivateModal(false) });
    }

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
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${planBadge[company.plan]}`}>{planLabel[company.plan] ?? company.plan}</span>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${company.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {company.is_active ? 'Active' : 'Suspendue'}
                                </span>
                                {isOnTrial && company.trial_ends_at && (
                                    <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs text-amber-500">
                                        Démo jusqu'au {new Date(company.trial_ends_at).toLocaleDateString('fr-FR')}
                                    </span>
                                )}
                                {company.current_subscription && (
                                    <span className="rounded-full bg-subtle px-2.5 py-0.5 text-xs text-muted">
                                        Expire le {new Date(company.current_subscription.ends_at).toLocaleDateString('fr-FR')}
                                    </span>
                                )}
                            </div>
                            {trialExpiresSoon && isOnTrial && (
                                <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:text-amber-400">
                                    La période démo se termine bientôt ({company.trial_ends_at ? new Date(company.trial_ends_at).toLocaleDateString('fr-FR') : ''}). Pensez à proposer une souscription.
                                </div>
                            )}
                        </div>

                        {/* Actions rapides */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    editForm.setData({ name: company.name, email: company.email, phone: company.phone ?? '', address: company.address ?? '' });
                                    setShowEditModal(true);
                                }}
                                className="rounded-lg border border-theme px-3 py-1.5 text-xs font-medium text-muted hover:bg-subtle transition"
                            >
                                Modifier les infos
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowSubscriptionModal(true)}
                                className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-primary hover:bg-brand-600 transition"
                            >
                                Attribuer un abonnement
                            </button>
                            <Link href={`${route('admin.payments.create')}?company_id=${company.id}`}
                                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-primary hover:bg-emerald-600 transition">
                                + Paiement
                            </Link>
                            {company.is_active
                                ? <button onClick={() => setShowSuspendModal(true)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition">Suspendre</button>
                                : <button onClick={() => setShowActivateModal(true)} className="rounded-lg border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition">Activer</button>
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
                            {[['Nom', company.name], ['Email', company.email], ['Téléphone', company.phone ?? '—'], ['Adresse', company.address ?? '—']].map(([l, v]) => (
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

                {/* Modal Attribuer un abonnement */}
                {showSubscriptionModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => !subscriptionForm.processing && setShowSubscriptionModal(false)}
                    >
                        <div
                            className="w-full max-w-md rounded-2xl border border-theme bg-surface p-6 shadow-xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-primary">Attribuer un abonnement</h3>
                                <button
                                    type="button"
                                    onClick={() => !subscriptionForm.processing && setShowSubscriptionModal(false)}
                                    className="rounded-lg p-1 text-muted hover:bg-subtle"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-sm text-muted mb-4">
                                Choisissez une des offres (plans) configurées dans{' '}
                                <Link href={route('admin.plans.index')} className="text-brand-500 hover:underline">
                                    Plans tarifaires
                                </Link>
                                , puis la durée et le paiement enregistré.
                            </p>

                            <form onSubmit={submitSubscription} className="space-y-4">
                                {/* Offre / Plan */}
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-muted">Offre (plan) *</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {plans.map(plan => (
                                            <button
                                                key={plan.id}
                                                type="button"
                                                onClick={() => {
                                                    subscriptionForm.setData(prev => ({
                                                        ...prev,
                                                        plan_id: plan.id,
                                                        amount: plan.price || prev.amount || 1,
                                                    }));
                                                }}
                                                className={`rounded-lg border p-3 text-left text-sm transition ${
                                                    subscriptionForm.data.plan_id === plan.id
                                                        ? 'border-brand-500 bg-brand-500/10 text-primary'
                                                        : 'border-theme bg-subtle/50 hover:border-theme text-primary'
                                                }`}
                                            >
                                                <p className="font-medium">{plan.name}</p>
                                                <p className="text-xs text-muted">{plan.price === 0 ? 'Gratuit' : `${fmt(plan.price)} FCFA`}</p>
                                            </button>
                                        ))}
                                    </div>
                                    {subscriptionForm.errors.plan_id && (
                                        <p className="mt-1 text-xs text-red-500">{subscriptionForm.errors.plan_id}</p>
                                    )}
                                </div>

                                {/* Durée */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted">Durée *</label>
                                    <select
                                        value={subscriptionForm.data.duration}
                                        onChange={e => subscriptionForm.setData('duration', e.target.value as '1_month' | '3_months' | '1_year')}
                                        className="field w-full rounded-lg px-3 py-2 text-sm"
                                    >
                                        {DURATION_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    {subscriptionForm.errors.duration && (
                                        <p className="mt-1 text-xs text-red-500">{subscriptionForm.errors.duration}</p>
                                    )}
                                </div>

                                {/* Montant */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted">Montant (FCFA) *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={subscriptionForm.data.amount || ''}
                                        onChange={e => subscriptionForm.setData('amount', e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0)}
                                        className="field w-full rounded-lg px-3 py-2 text-sm"
                                    />
                                    {selectedPlan && subscriptionForm.data.amount > 0 && subscriptionForm.data.amount !== selectedPlan.price && (
                                        <p className="mt-1 text-xs text-amber-500">Montant différent du prix du plan ({fmt(selectedPlan.price)} FCFA)</p>
                                    )}
                                    {subscriptionForm.errors.amount && (
                                        <p className="mt-1 text-xs text-red-500">{subscriptionForm.errors.amount}</p>
                                    )}
                                </div>

                                {/* Moyen de paiement */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted">Moyen de paiement *</label>
                                    <select
                                        value={subscriptionForm.data.payment_method}
                                        onChange={e => subscriptionForm.setData('payment_method', e.target.value)}
                                        className="field w-full rounded-lg px-3 py-2 text-sm"
                                    >
                                        {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                    {subscriptionForm.errors.payment_method && (
                                        <p className="mt-1 text-xs text-red-500">{subscriptionForm.errors.payment_method}</p>
                                    )}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted">Notes (optionnel)</label>
                                    <textarea
                                        value={subscriptionForm.data.notes}
                                        onChange={e => subscriptionForm.setData('notes', e.target.value)}
                                        rows={2}
                                        className="field w-full rounded-lg px-3 py-2 text-sm resize-none"
                                        placeholder="Réf. virement, etc."
                                    />
                                    {subscriptionForm.errors.notes && (
                                        <p className="mt-1 text-xs text-red-500">{subscriptionForm.errors.notes}</p>
                                    )}
                                </div>

                                <div className="flex gap-2 justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowSubscriptionModal(false)}
                                        className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-muted hover:bg-subtle"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={subscriptionForm.processing || !subscriptionForm.data.plan_id || (subscriptionForm.data.amount ?? 0) < 1}
                                        className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-primary hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {subscriptionForm.processing ? 'Enregistrement…' : 'Enregistrer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Modifier les infos */}
                {showEditModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => !editForm.processing && setShowEditModal(false)}
                    >
                        <div
                            className="w-full max-w-md rounded-2xl border border-theme bg-surface p-6 shadow-xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-primary">Modifier les informations</h3>
                                <button type="button" onClick={() => !editForm.processing && setShowEditModal(false)} className="rounded-lg p-1 text-muted hover:bg-subtle">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={submitEdit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted">Nom *</label>
                                    <input
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={e => editForm.setData('name', e.target.value)}
                                        className="field w-full rounded-lg px-3 py-2 text-sm"
                                        required
                                    />
                                    {editForm.errors.name && <p className="mt-1 text-xs text-red-500">{editForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted">Email *</label>
                                    <input
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={e => editForm.setData('email', e.target.value)}
                                        className="field w-full rounded-lg px-3 py-2 text-sm"
                                        required
                                    />
                                    {editForm.errors.email && <p className="mt-1 text-xs text-red-500">{editForm.errors.email}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted">Téléphone</label>
                                    <input
                                        type="text"
                                        value={editForm.data.phone}
                                        onChange={e => editForm.setData('phone', e.target.value)}
                                        className="field w-full rounded-lg px-3 py-2 text-sm"
                                        placeholder="+225..."
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted">Adresse</label>
                                    <input
                                        type="text"
                                        value={editForm.data.address}
                                        onChange={e => editForm.setData('address', e.target.value)}
                                        className="field w-full rounded-lg px-3 py-2 text-sm"
                                        placeholder="Ville, pays"
                                    />
                                </div>
                                <div className="flex gap-2 justify-end pt-2">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-muted hover:bg-subtle">
                                        Annuler
                                    </button>
                                    <button type="submit" disabled={editForm.processing} className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-primary hover:bg-brand-600 disabled:opacity-50">
                                        {editForm.processing ? 'Enregistrement…' : 'Enregistrer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <ConfirmModal
                    show={showSuspendModal}
                    onClose={() => setShowSuspendModal(false)}
                    onConfirm={doSuspend}
                    title="Suspendre l'entreprise"
                    description={`Voulez-vous suspendre « ${company.name} » ? Les utilisateurs ne pourront plus accéder à l'application.`}
                    confirmText="Suspendre"
                    variant="danger"
                />
                <ConfirmModal
                    show={showActivateModal}
                    onClose={() => setShowActivateModal(false)}
                    onConfirm={doActivate}
                    title="Activer l'entreprise"
                    description={`Voulez-vous réactiver « ${company.name} » ?`}
                    confirmText="Activer"
                    variant="primary"
                />
            </div>
        </AuthenticatedLayout>
    );
}
