import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Invoice, PageProps, Payment, Plan, Subscription } from '@/types';
import { Head } from '@inertiajs/react';

type Props = PageProps<{
    subscription: Subscription | null;
    plans: Plan[];
    payments: Payment[];
    invoices: Invoice[];
}>;

function fmt(n: number) { return new Intl.NumberFormat('fr-FR').format(n); }

const statusBadge: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    pending: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
    expired: 'bg-red-500/20 text-red-600 dark:text-red-400',
    cancelled: 'bg-gray-500/20 text-secondary',
    suspended: 'bg-red-500/20 text-red-500',
};
const paymentStatus: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    pending: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
    failed: 'bg-red-500/20 text-red-600 dark:text-red-400',
};
// Libellé générique côté client (sans exposer CinetPay, Wave, etc.)
function paymentMethodLabel(method: string): string {
    return 'Paiement';
}

export default function SubscriptionIndex({ subscription, plans, payments, invoices }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Mon abonnement" />
            <div className="space-y-6">
                <h1 className="text-xl font-bold text-primary">Mon abonnement</h1>

                {/* Abonnement actuel */}
                <div className="rounded-xl border border-theme bg-surface p-6">
                    {subscription ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-bold text-primary">{subscription.plan?.name ?? 'Plan'}</p>
                                    <p className="text-sm text-secondary">
                                        {subscription.plan ? `${fmt(subscription.plan.price)} FCFA / ${subscription.plan.billing_cycle === 'monthly' ? 'mois' : subscription.plan.billing_cycle === 'quarterly' ? 'trimestre' : 'an'}` : ''}
                                    </p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[subscription.status] ?? 'bg-gray-500/20 text-secondary'}`}>
                                    {subscription.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                                <div><span className="text-muted">Début</span><p className="text-primary">{new Date(subscription.starts_at).toLocaleDateString('fr-FR')}</p></div>
                                <div><span className="text-muted">Fin</span><p className="text-primary">{new Date(subscription.ends_at).toLocaleDateString('fr-FR')}</p></div>
                                <div><span className="text-muted">Jours restants</span><p className="text-emerald-600 dark:text-emerald-400 font-semibold">{subscription.days_remaining ?? '—'}</p></div>
                                {subscription.trial_ends_at && (
                                    <div><span className="text-muted">Fin essai</span><p className="text-primary">{new Date(subscription.trial_ends_at).toLocaleDateString('fr-FR')}</p></div>
                                )}
                            </div>
                            {subscription.plan?.features && (
                                <div>
                                    <p className="text-xs text-muted mb-2">Fonctionnalités incluses</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {Object.entries(subscription.plan.features).filter(([, v]) => v).map(([k]) => (
                                            <span key={k} className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                                                {k.replace(/_/g, ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-subtle mb-3">
                                <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-sm text-secondary">Aucun abonnement actif</p>
                            <p className="mt-1 text-xs text-muted">Contactez-nous pour choisir un plan adapté à vos besoins.</p>
                        </div>
                    )}
                </div>

                {/* Plans disponibles */}
                {plans.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-primary mb-3">Plans disponibles</h2>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {plans.map(plan => (
                                <div key={plan.id} className={`rounded-xl border p-4 space-y-2 ${subscription?.plan_id === plan.id
                                    ? 'border-emerald-500 bg-emerald-500/5'
                                    : 'border-theme bg-surface'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-primary">{plan.name}</h3>
                                        {subscription?.plan_id === plan.id && (
                                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">Actuel</span>
                                        )}
                                    </div>
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{plan.price === 0 ? 'Gratuit' : `${fmt(plan.price)} FCFA`}<span className="text-xs text-muted font-normal"> / {plan.billing_cycle === 'monthly' ? 'mois' : plan.billing_cycle === 'quarterly' ? 'trim.' : 'an'}</span></p>
                                    <p className="text-xs text-muted">{plan.max_employees ? `${plan.max_employees} employés` : 'Employés illimités'} · {plan.max_locations} zone(s)</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Historique des paiements */}
                {payments.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-primary mb-3">Historique des paiements</h2>
                        <div className="overflow-hidden rounded-xl border border-theme bg-surface">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-theme">
                                        <th className="px-4 py-2 text-left text-xs text-muted">Date</th>
                                        <th className="px-4 py-2 text-left text-xs text-muted">Montant</th>
                                        <th className="px-4 py-2 text-left text-xs text-muted">Méthode</th>
                                        <th className="px-4 py-2 text-left text-xs text-muted">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {payments.map(p => (
                                        <tr key={p.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                                            <td className="px-4 py-2 text-sm text-primary">{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{fmt(p.amount)} FCFA</td>
                                            <td className="px-4 py-2 text-sm text-secondary">{paymentMethodLabel(p.payment_method)}</td>
                                            <td className="px-4 py-2"><span className={`rounded-full px-2 py-0.5 text-xs ${paymentStatus[p.status] ?? 'bg-gray-500/20 text-secondary'}`}>{p.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Factures */}
                {invoices.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-primary mb-3">Factures</h2>
                        <div className="space-y-2">
                            {invoices.map(inv => (
                                <div key={inv.id} className="flex items-center justify-between rounded-xl border border-theme bg-surface px-4 py-3">
                                    <div>
                                        <p className="text-sm font-mono text-primary">{inv.invoice_number}</p>
                                        <p className="text-xs text-muted">{new Date(inv.due_date).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{fmt(inv.total_amount)} FCFA</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
