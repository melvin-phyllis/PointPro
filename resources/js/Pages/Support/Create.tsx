import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function ClientSupportCreate(_: PageProps) {
    const { data, setData, post, errors, processing } = useForm({
        subject: '',
        category: 'general',
        priority: 'medium',
        body: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(route('client.tickets.store'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Nouveau ticket" />
            <div className="mx-auto max-w-xl space-y-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href={route('client.tickets.index')} className="hover:text-emerald-400">Support</Link>
                    <span>/</span><span className="text-gray-200">Nouveau ticket</span>
                </div>
                <h1 className="text-xl font-bold text-white">Créer un ticket de support</h1>

                <form onSubmit={submit} className="space-y-4 rounded-xl border border-white/10 bg-[#0D1117] p-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Sujet *</label>
                        <input value={data.subject} onChange={e => setData('subject', e.target.value)} placeholder="Décrivez brièvement votre problème..."
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
                        {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Catégorie</label>
                            <select value={data.category} onChange={e => setData('category', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                                <option value="general">Général</option>
                                <option value="bug">Bug / Problème technique</option>
                                <option value="billing">Facturation</option>
                                <option value="feature_request">Demande de fonctionnalité</option>
                                <option value="account">Compte</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Priorité</label>
                            <select value={data.priority} onChange={e => setData('priority', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                                <option value="low">Basse</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                                <option value="urgent">Urgente</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Description *</label>
                        <textarea value={data.body} onChange={e => setData('body', e.target.value)} rows={5}
                            placeholder="Décrivez votre problème en détail..."
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:outline-none resize-none" />
                        {errors.body && <p className="mt-1 text-xs text-red-400">{errors.body}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Link href={route('client.tickets.index')} className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-gray-200">Annuler</Link>
                        <button type="submit" disabled={processing}
                            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50 transition">
                            {processing ? 'Envoi...' : 'Envoyer le ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
