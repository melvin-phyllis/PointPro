import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Invoice, PageProps, Payment, Plan, Subscription } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Props = PageProps<{
    subscription: Subscription | null;
    plans: Plan[];
    payments: Payment[];
    invoices: Invoice[];
}>;

function fmt(n: number) { return new Intl.NumberFormat('fr-FR').format(n); }

const statusBadge: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-400', pending: 'bg-amber-500/20 text-amber-400',
    expired: 'bg-red-500/20 text-red-400', cancelled: 'bg-gray-500/20 text-gray-400',
    suspended: 'bg-red-500/20 text-red-300',
};
const paymentStatus: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-400', pending: 'bg-amber-500/20 text-amber-400',
    failed: 'bg-red-500/20 text-red-400',
};

export default function SubscriptionIndex({ subscription, plans, payments, invoices }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Mon abonnement" />
            <div className="space-y-6">
                <h1 className="text-xl font-bold text-white">Mon abonnement</h1>

                {/* Abonnement actuel */}
                <div className="rounded-xl border border-white/10 bg-[#0D1117] p-6">
                    {subscription ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-bold text-white">{subscription.plan?.name ?? 'Plan'}</p>
                                    <p className="text-sm text-gray-400">
                                        {subscription.plan ? `${fmt(subscription.plan.price)} FCFA / ${subscription.plan.billing_cycle === 'monthly' ? 'mois' : subscription.plan.billing_cycle === 'quarterly' ? 'trimestre' : 'an'}` : ''}
                                    </p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[subscription.status] ?? 'bg-gray-500/20 text-gray-400'}`}>
                                    {subscription.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                                <div><span className="text-gray-500">Début</span><p className="text-gray-200">{new Date(subscription.starts_at).toLocaleDateString('fr-FR')}</p></div>
                                <div><span className="text-gray-500">Fin</span><p className="text-gray-200">{new Date(subscription.ends_at).toLocaleDateString('fr-FR')}</p></div>
                                <div><span className="text-gray-500">Jours restants</span><p className="text-emerald-400 font-semibold">{subscription.days_remaining ?? '—'}</p></div>
                                {subscription.trial_ends_at && (
                                    <div><span className="text-gray-500">Fin essai</span><p className="text-gray-200">{new Date(subscription.trial_ends_at).toLocaleDateString('fr-FR')}</p></div>
                                )}
                            </div>
                            {subscription.plan?.features && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Fonctionnalités incluses</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {Object.entries(subscription.plan.features).filter(([, v]) => v).map(([k]) => (
                                            <span key={k} className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
                                                {k.replace(/_/g, ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-500/10 mb-3">
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-400">Aucun abonnement actif</p>
                            <p className="mt-1 text-xs text-gray-500">Contactez-nous pour choisir un plan adapté à vos besoins.</p>
                        </div>
                    )}
                </div>

                {/* Plans disponibles */}
                {plans.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-white mb-3">Plans disponibles</h2>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {plans.map(plan => (
                                <div key={plan.id} className={`rounded-xl border p-4 space-y-2 ${subscription?.plan_id === plan.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 bg-[#0D1117]'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-white">{plan.name}</h3>
                                        {subscription?.plan_id === plan.id && (
                                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">Actuel</span>
                                        )}
                                    </div>
                                    <p className="text-lg font-bold text-emerald-400">{plan.price === 0 ? 'Gratuit' : `${fmt(plan.price)} FCFA`}<span className="text-xs text-gray-500 font-normal"> / {plan.billing_cycle === 'monthly' ? 'mois' : plan.billing_cycle === 'quarterly' ? 'trim.' : 'an'}</span></p>
                                    <p className="text-xs text-gray-500">{plan.max_employees ? `${plan.max_employees} employés` : 'Employés illimités'} · {plan.max_locations} zone(s)</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Historique des paiements */}
                {payments.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-white mb-3">Historique des paiements</h2>
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0D1117]">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-4 py-2 text-left text-xs text-gray-500">Date</th>
                                        <th className="px-4 py-2 text-left text-xs text-gray-500">Montant</th>
                                        <th className="px-4 py-2 text-left text-xs text-gray-500">Méthode</th>
                                        <th className="px-4 py-2 text-left text-xs text-gray-500">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {payments.map(p => (
                                        <tr key={p.id} className="hover:bg-white/[0.02]">
                                            <td className="px-4 py-2 text-sm text-gray-300">{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-4 py-2 text-sm font-semibold text-emerald-400">{fmt(p.amount)} FCFA</td>
                                            <td className="px-4 py-2 text-sm text-gray-400">{p.payment_method}</td>
                                            <td className="px-4 py-2"><span className={`rounded-full px-2 py-0.5 text-xs ${paymentStatus[p.status] ?? 'bg-gray-500/20 text-gray-400'}`}>{p.status}</span></td>
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
                        <h2 className="text-sm font-semibold text-white mb-3">Factures</h2>
                        <div className="space-y-2">
                            {invoices.map(inv => (
                                <div key={inv.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0D1117] px-4 py-3">
                                    <div>
                                        <p className="text-sm font-mono text-gray-200">{inv.invoice_number}</p>
                                        <p className="text-xs text-gray-500">{new Date(inv.due_date).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-emerald-400">{fmt(inv.total_amount)} FCFA</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
