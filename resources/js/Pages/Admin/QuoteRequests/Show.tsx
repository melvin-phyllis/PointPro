import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Plan } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Building2, CreditCard, MessageSquare, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

export interface QuoteRequestDetail {
    id: number;
    company_name: string;
    plan: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    message: string | null;
    company_id: number | null;
    created_at: string;
    company?: { id: number; name: string } | null;
}

type Props = PageProps<{
    quoteRequest: QuoteRequestDetail;
    plans: Plan[];
}>;

const planBadge: Record<string, string> = {
    starter: 'bg-gray-500/20 text-muted',
    business: 'bg-blue-500/20 text-blue-400',
    enterprise: 'bg-emerald-500/20 text-emerald-400',
};

const planLabel: Record<string, string> = {
    starter: 'Starter',
    business: 'Business',
    enterprise: 'Enterprise',
};

const TRIAL_OPTIONS = [
    { value: 30, label: '30 jours' },
    { value: 45, label: '45 jours' },
    { value: 60, label: '2 mois (60 jours)' },
];

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

export default function QuoteRequestShow({ quoteRequest: r, plans = [] }: Props) {
    const [showTrialModal, setShowTrialModal] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [trialDays, setTrialDays] = useState(30);

    const subscriptionForm = useForm({
        plan_id: '' as number | '',
        duration: '1_month' as '1_month' | '3_months' | '1_year',
        amount: 0,
        payment_method: 'bank_transfer' as string,
        notes: '',
    });

    const selectedPlan = plans.find(p => p.id === Number(subscriptionForm.data.plan_id));

    const createCompany = () => {
        router.post(route('admin.quote-requests.create-company', r.id), { trial_days: trialDays }, {
            onSuccess: () => setShowTrialModal(false),
        });
    };

    const submitSubscription = (e: FormEvent) => {
        e.preventDefault();
        subscriptionForm.post(route('admin.quote-requests.create-company-with-subscription', r.id), {
            onSuccess: () => {
                setShowSubscriptionModal(false);
                subscriptionForm.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Demande de devis — ${r.company_name}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href={route('admin.quote-requests.index')} className="hover:text-emerald-400">
                        Demandes de devis
                    </Link>
                    <span>/</span>
                    <span className="text-primary">{r.company_name}</span>
                </div>

                {/* Offre choisie par le client — bien visible */}
                <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                        Offre choisie par le client
                    </p>
                    <p className="text-lg font-bold text-primary">
                        {r.plan ? (
                            <span
                                className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${planBadge[r.plan] ?? 'bg-gray-500/20 text-muted'}`}
                            >
                                {planLabel[r.plan] ?? r.plan}
                            </span>
                        ) : (
                            <span className="text-amber-600 dark:text-amber-400">Non renseigné</span>
                        )}
                    </p>
                </div>

                <div className="rounded-xl border border-theme bg-surface p-6">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
                        Récapitulatif de la demande
                    </h2>
                    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <dt className="text-xs font-medium text-muted">Entreprise</dt>
                            <dd className="mt-0.5 text-sm font-medium text-primary">{r.company_name}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-muted">Forfait choisi</dt>
                            <dd className="mt-0.5">
                                <span
                                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${planBadge[r.plan] ?? 'bg-gray-500/20 text-muted'}`}
                                >
                                    {planLabel[r.plan] ?? r.plan}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-muted">Prénom</dt>
                            <dd className="mt-0.5 text-sm text-primary">{r.first_name}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-muted">Nom</dt>
                            <dd className="mt-0.5 text-sm text-primary">{r.last_name}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-muted">Email</dt>
                            <dd className="mt-0.5">
                                <a
                                    href={`mailto:${r.email}`}
                                    className="text-sm font-medium text-primary hover:text-emerald-400"
                                >
                                    {r.email}
                                </a>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-muted">Téléphone</dt>
                            <dd className="mt-0.5 text-sm text-primary">
                                {r.phone ? (
                                    <a href={`tel:${r.phone}`} className="hover:text-emerald-400">{r.phone}</a>
                                ) : (
                                    '—'
                                )}
                            </dd>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <dt className="text-xs font-medium text-muted">Date de réception</dt>
                            <dd className="mt-0.5 text-sm text-primary">
                                {new Date(r.created_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </dd>
                        </div>
                    </dl>

                    {r.message && (
                        <div className="mt-4 rounded-lg border border-theme bg-subtle/30 p-4">
                            <p className="mb-2 flex items-center gap-2 text-xs font-medium text-muted">
                                <MessageSquare size={14} />
                                Message du contact
                            </p>
                            <p className="whitespace-pre-wrap text-sm text-primary">{r.message}</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href={route('admin.quote-requests.index')}
                        className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-muted transition hover:bg-subtle"
                    >
                        ← Retour à la liste
                    </Link>
                    {r.company_id && r.company ? (
                        <Link
                            href={route('admin.companies.show', r.company.id)}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-primary transition hover:bg-emerald-600"
                        >
                            <Building2 size={18} />
                            Voir l'entreprise créée
                        </Link>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setShowTrialModal(true)}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-primary transition hover:bg-emerald-600"
                            >
                                <Building2 size={18} />
                                Créer l'entreprise (démo)
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowSubscriptionModal(true)}
                                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-primary transition hover:bg-brand-600"
                            >
                                <CreditCard size={18} />
                                Attribuer une offre (abonnement direct)
                            </button>
                            {showTrialModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowTrialModal(false)}>
                                    <div className="w-full max-w-md rounded-xl border border-theme bg-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-primary">Créer l'entreprise en démo</h3>
                                            <button type="button" onClick={() => setShowTrialModal(false)} className="rounded-lg p-1 text-muted hover:bg-subtle">
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <p className="text-sm text-muted mb-4">
                                            Choisissez la durée de la démo (30 jours à 2 mois). Un email avec le mot de passe temporaire sera envoyé au contact.
                                        </p>
                                        <label className="mb-2 block text-xs font-medium text-muted">Durée de la démo</label>
                                        <select
                                            value={trialDays}
                                            onChange={(e) => setTrialDays(Number(e.target.value))}
                                            className="mb-4 w-full rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none"
                                        >
                                            {TRIAL_OPTIONS.map((o) => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2 justify-end">
                                            <button type="button" onClick={() => setShowTrialModal(false)} className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-muted hover:bg-subtle">
                                                Annuler
                                            </button>
                                            <button type="button" onClick={createCompany} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-primary hover:bg-emerald-600">
                                                Créer la démo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modal Attribuer une offre (abonnement direct) */}
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
                                            <h3 className="text-lg font-semibold text-primary">Attribuer une offre (abonnement direct)</h3>
                                            <button
                                                type="button"
                                                onClick={() => !subscriptionForm.processing && setShowSubscriptionModal(false)}
                                                className="rounded-lg p-1 text-muted hover:bg-subtle"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <p className="text-sm text-muted mb-4">
                                            Crée l&apos;entreprise et lui attribue directement un abonnement. Le contact pourra se connecter sans passer par la démo. Choisissez une des offres dans{' '}
                                            <Link href={route('admin.plans.index')} className="text-brand-500 hover:underline">Plans tarifaires</Link>.
                                        </p>

                                        <form onSubmit={submitSubscription} className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-xs font-medium text-muted">Offre (plan) *</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {plans.map(plan => (
                                                        <button
                                                            key={plan.id}
                                                            type="button"
                                                            onClick={() => subscriptionForm.setData(prev => ({
                                                                ...prev,
                                                                plan_id: plan.id,
                                                                amount: plan.price > 0 ? plan.price : (prev.amount || 1),
                                                            }))}
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
                                                {subscriptionForm.errors.plan_id && <p className="mt-1 text-xs text-red-500">{subscriptionForm.errors.plan_id}</p>}
                                            </div>

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
                                                {subscriptionForm.errors.duration && <p className="mt-1 text-xs text-red-500">{subscriptionForm.errors.duration}</p>}
                                            </div>

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
                                                {subscriptionForm.errors.amount && <p className="mt-1 text-xs text-red-500">{subscriptionForm.errors.amount}</p>}
                                            </div>

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
                                                {subscriptionForm.errors.payment_method && <p className="mt-1 text-xs text-red-500">{subscriptionForm.errors.payment_method}</p>}
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-muted">Notes (optionnel)</label>
                                                <textarea
                                                    value={subscriptionForm.data.notes}
                                                    onChange={e => subscriptionForm.setData('notes', e.target.value)}
                                                    rows={2}
                                                    className="field w-full rounded-lg px-3 py-2 text-sm resize-none"
                                                    placeholder="Réf. virement, etc."
                                                />
                                                {subscriptionForm.errors.notes && <p className="mt-1 text-xs text-red-500">{subscriptionForm.errors.notes}</p>}
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
                                                    {subscriptionForm.processing ? 'Création…' : 'Créer l\'entreprise et attribuer l\'abonnement'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
