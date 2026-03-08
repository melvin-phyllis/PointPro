import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const defaultFeatures = {
    basic_attendance: true, geolocation: false, multi_site: false,
    reports: false, export: false, api_access: false, priority_support: false, sso: false,
};

export default function PlanCreate(_: PageProps) {
    const { data, setData, post, errors, processing } = useForm({
        name: '', slug: '', price: 0, max_employees: '', max_locations: 1,
        features: defaultFeatures as Record<string, boolean>,
        billing_cycle: 'monthly', is_active: true, sort_order: 0,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(route('admin.plans.store'));
    }

    function toggleFeature(key: string) {
        setData('features', { ...data.features, [key]: !data.features[key] });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Nouveau plan" />
            <div className="mx-auto max-w-xl space-y-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href={route('admin.plans.index')} className="hover:text-emerald-400">Plans</Link>
                    <span>/</span><span className="text-primary">Nouveau</span>
                </div>
                <h1 className="text-xl font-bold text-primary">Créer un plan</h1>

                <form onSubmit={submit} className="space-y-4 rounded-xl border border-theme bg-surface p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium text-muted mb-1">Nom *</label>
                            <input value={data.name} onChange={e => { setData('name', e.target.value); setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-')); }}
                                className="w-full rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none" />
                            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted mb-1">Slug *</label>
                            <input value={data.slug} onChange={e => setData('slug', e.target.value)}
                                className="w-full rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted mb-1">Prix (FCFA) *</label>
                            <input type="number" value={data.price} onChange={e => setData('price', +e.target.value)} min={0}
                                className="w-full rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted mb-1">Cycle de facturation</label>
                            <select value={data.billing_cycle} onChange={e => setData('billing_cycle', e.target.value)}
                                className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none">
                                <option value="monthly">Mensuel</option>
                                <option value="quarterly">Trimestriel</option>
                                <option value="yearly">Annuel</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted mb-1">Max employés (vide = illimité)</label>
                            <input type="number" value={data.max_employees} onChange={e => setData('max_employees', e.target.value)} min={1}
                                className="w-full rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted mb-1">Max zones GPS *</label>
                            <input type="number" value={data.max_locations} onChange={e => setData('max_locations', +e.target.value)} min={1}
                                className="w-full rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-muted mb-2">Fonctionnalités</label>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(data.features).map(([k, v]) => (
                                <label key={k} className="flex items-center gap-2 cursor-pointer rounded-lg border border-theme bg-white/[0.02] px-3 py-2">
                                    <input type="checkbox" checked={v} onChange={() => toggleFeature(k)} className="accent-emerald-500" />
                                    <span className="text-xs text-secondary">{k.replace(/_/g, ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="accent-emerald-500" />
                        <span className="text-sm text-secondary">Plan actif</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <Link href={route('admin.plans.index')} className="rounded-lg px-4 py-2 text-sm text-muted hover:text-primary">Annuler</Link>
                        <button type="submit" disabled={processing} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-primary hover:bg-emerald-600 disabled:opacity-50">
                            {processing ? 'Création...' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
