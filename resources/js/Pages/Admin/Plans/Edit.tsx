import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Plan } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Props = PageProps<{ plan: Plan }>;

export default function PlanEdit({ plan }: Props) {
    const { data, setData, put, errors, processing } = useForm({
        name: plan.name,
        price: plan.price,
        max_employees: plan.max_employees ?? ('' as string | number),
        max_locations: plan.max_locations,
        features: plan.features as Record<string, boolean>,
        billing_cycle: plan.billing_cycle,
        is_active: plan.is_active,
        sort_order: plan.sort_order,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        put(route('admin.plans.update', plan.id));
    }

    function toggleFeature(key: string) {
        setData('features', { ...data.features, [key]: !data.features[key] });
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Modifier — ${plan.name}`} />
            <div className="mx-auto max-w-xl space-y-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href={route('admin.plans.index')} className="hover:text-emerald-400">Plans</Link>
                    <span>/</span><span className="text-gray-200">{plan.name}</span>
                </div>
                <h1 className="text-xl font-bold text-white">Modifier le plan « {plan.name} »</h1>

                <form onSubmit={submit} className="space-y-4 rounded-xl border border-white/10 bg-[#0D1117] p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Nom *</label>
                            <input value={data.name} onChange={e => setData('name', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none" />
                            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Slug</label>
                            <input value={plan.slug} disabled
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Prix (FCFA) *</label>
                            <input type="number" value={data.price} onChange={e => setData('price', +e.target.value)} min={0}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Cycle de facturation</label>
                            <select value={data.billing_cycle} onChange={e => setData('billing_cycle', e.target.value as 'monthly' | 'quarterly' | 'yearly')}
                                className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                                <option value="monthly">Mensuel</option>
                                <option value="quarterly">Trimestriel</option>
                                <option value="yearly">Annuel</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Max employés (vide = illimité)</label>
                            <input type="number" value={data.max_employees} onChange={e => setData('max_employees', e.target.value === '' ? '' : +e.target.value)} min={1}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Max zones GPS *</label>
                            <input type="number" value={data.max_locations} onChange={e => setData('max_locations', +e.target.value)} min={1}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">Fonctionnalités</label>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(data.features).map(([k, v]) => (
                                <label key={k} className="flex items-center gap-2 cursor-pointer rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                                    <input type="checkbox" checked={v} onChange={() => toggleFeature(k)} className="accent-emerald-500" />
                                    <span className="text-xs text-gray-300">{k.replace(/_/g, ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="accent-emerald-500" />
                        <span className="text-sm text-gray-300">Plan actif</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <Link href={route('admin.plans.index')} className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-gray-200">Annuler</Link>
                        <button type="submit" disabled={processing} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50 transition">
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
