import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Plan } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Props = PageProps<{ plans: Plan[] }>;

function fmt(n: number) {
    return new Intl.NumberFormat('fr-FR').format(n);
}

export default function CompanyCreate({ plans = [] }: Props) {
    const firstPlanSlug = plans[0]?.slug ?? 'starter';
    const { data, setData, post, errors, processing } = useForm({
        name: '', email: '', phone: '', address: '', plan: firstPlanSlug as string,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(route('admin.companies.store'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Nouvelle entreprise" />
            <div className="mx-auto max-w-lg space-y-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href={route('admin.companies.index')} className="hover:text-emerald-400">Entreprises</Link>
                    <span>/</span><span className="text-primary">Nouvelle</span>
                </div>

                <h1 className="text-xl font-bold text-primary">Ajouter une entreprise</h1>

                <form onSubmit={submit} className="rounded-xl border border-theme bg-surface p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">Nom *</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                            placeholder="Raison sociale"
                            className="w-full rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">Email *</label>
                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                            placeholder="contact@entreprise.com"
                            className="w-full rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">Téléphone</label>
                        <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)}
                            placeholder="+225 07 00 00 00 00"
                            className="w-full rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
                        {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">Adresse</label>
                        <input type="text" value={data.address} onChange={e => setData('address', e.target.value)}
                            placeholder="Ville, pays"
                            className="w-full rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
                        {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">Plan *</label>
                        <select value={data.plan} onChange={e => setData('plan', e.target.value)}
                            className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none">
                            {plans.length > 0 ? (
                                plans.map(p => (
                                    <option key={p.id} value={p.slug}>
                                        {p.name} — {p.price === 0 ? 'Gratuit' : `${fmt(p.price)} FCFA`}
                                    </option>
                                ))
                            ) : (
                                <>
                                    <option value="starter">Starter</option>
                                    <option value="business">Business</option>
                                    <option value="enterprise">Enterprise</option>
                                    <option value="custom">Custom</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Link href={route('admin.companies.index')} className="rounded-lg px-4 py-2 text-sm text-muted hover:text-primary transition">Annuler</Link>
                        <button type="submit" disabled={processing}
                            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-primary hover:bg-emerald-600 disabled:opacity-50 transition">
                            {processing ? 'Création...' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
