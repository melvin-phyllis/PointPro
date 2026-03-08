import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { PageProps, Plan } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type Props = PageProps<{ plans: (Plan & { subscriptions_count: number })[] }>;

export default function PlansIndex({ plans }: Props) {
    const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

    function destroy() {
        if (!planToDelete) return;
        router.delete(route('admin.plans.destroy', planToDelete.id), {
            onSuccess: () => setPlanToDelete(null),
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Plans tarifaires" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-primary">Plans tarifaires</h1>
                        <p className="text-sm text-muted">{plans.length} plan(s) configuré(s)</p>
                    </div>
                    <Link href={route('admin.plans.create')} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-primary hover:bg-emerald-600 transition">
                        + Nouveau plan
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.map(plan => (
                        <div key={plan.id} className={`rounded-xl border p-5 space-y-4 ${plan.is_active ? 'border-theme bg-surface' : 'border-theme bg-white/[0.01] opacity-60'}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-primary">{plan.name}</h3>
                                    <p className="text-xs text-gray-500">{plan.slug}</p>
                                </div>
                                <span className={`rounded-full px-2 py-0.5 text-xs ${plan.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-muted'}`}>
                                    {plan.is_active ? 'Actif' : 'Inactif'}
                                </span>
                            </div>

                            <p className="text-2xl font-bold text-emerald-400">
                                {plan.price === 0 ? 'Gratuit' : `${new Intl.NumberFormat('fr-FR').format(plan.price)} FCFA`}
                                {plan.price > 0 && <span className="text-sm font-normal text-gray-500">/mois</span>}
                            </p>

                            <div className="space-y-1 text-xs text-muted">
                                <p>👥 {plan.max_employees ?? '∞'} employés max</p>
                                <p>📍 {plan.max_locations ?? '∞'} zones GPS max</p>
                                <p>🔄 {plan.billing_cycle}</p>
                            </div>

                            <div className="space-y-1">
                                {Object.entries(plan.features).map(([k, v]) => (
                                    <div key={k} className="flex items-center gap-2 text-xs">
                                        <span className={v ? 'text-emerald-400' : 'text-gray-600'}>{v ? '✓' : '✗'}</span>
                                        <span className={v ? 'text-secondary' : 'text-gray-600'}>{k.replace(/_/g, ' ')}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between border-t border-theme pt-3">
                                <p className="text-xs text-gray-500">{plan.subscriptions_count} abonné(s)</p>
                                <div className="flex gap-2">
                                    <Link href={route('admin.plans.edit', plan.id)} className="text-xs text-emerald-400 hover:underline">Modifier</Link>
                                    <button onClick={() => setPlanToDelete(plan)} className="text-xs text-red-400 hover:underline">Supprimer</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ConfirmModal
                show={planToDelete !== null}
                onClose={() => setPlanToDelete(null)}
                onConfirm={destroy}
                title="Supprimer le plan"
                description={`Êtes-vous sûr de vouloir supprimer le plan "${planToDelete?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
            />
        </AuthenticatedLayout >
    );
}
