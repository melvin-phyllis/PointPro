import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function CompanyCreate(_: PageProps) {
    const { data, setData, post, errors, processing } = useForm({
        name: '', email: '', phone: '', address: '', plan: 'starter' as string,
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
                    {([
                        { id: 'name',    label: 'Nom',      type: 'text',  required: true },
                        { id: 'email',   label: 'Email',    type: 'email', required: true },
                        { id: 'phone',   label: 'Téléphone',type: 'text',  required: false },
                        { id: 'address', label: 'Adresse',  type: 'text',  required: false },
                    ] as const).map(f => (
                        <div key={f.id}>
                            <label className="block text-xs font-medium text-muted mb-1">{f.label}{f.required && ' *'}</label>
                            <input type={f.type} value={data[f.id]} onChange={e => setData(f.id, e.target.value)}
                                className="w-full rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
                            {errors[f.id] && <p className="mt-1 text-xs text-red-400">{errors[f.id]}</p>}
                        </div>
                    ))}

                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">Plan *</label>
                        <select value={data.plan} onChange={e => setData('plan', e.target.value)}
                            className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none">
                            <option value="starter">Starter — Gratuit</option>
                            <option value="business">Business — 25 000 FCFA/mois</option>
                            <option value="enterprise">Enterprise — 75 000 FCFA/mois</option>
                            <option value="custom">Custom</option>
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
