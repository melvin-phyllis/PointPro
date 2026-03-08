import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const Spinner = () => (
    <svg className="h-4 w-4 animate-spin-slow" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
);

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
            <div className="mx-auto max-w-xl space-y-6 animate-fade-in">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted">
                    <Link href={route('client.tickets.index')} className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Support
                    </Link>
                    <span className="text-muted">/</span>
                    <span className="text-primary">Nouveau ticket</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                        <svg className="h-5 w-5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-primary">Créer un ticket de support</h1>
                        <p className="text-sm text-muted">Notre équipe vous répondra dans les meilleurs délais</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-theme bg-surface p-6 animate-slide-up">
                    <div>
                        <label className="block text-xs font-medium text-secondary mb-1.5">
                            <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                Sujet *
                            </span>
                        </label>
                        <input value={data.subject} onChange={e => setData('subject', e.target.value)} placeholder="Décrivez brièvement votre problème..."
                            className="w-full rounded-lg border border-theme bg-subtle px-3 py-2.5 text-sm text-primary placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus-ring transition-colors" />
                        {errors.subject && <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>{errors.subject}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium text-secondary mb-1.5">Catégorie</label>
                            <select value={data.category} onChange={e => setData('category', e.target.value)}
                                className="w-full rounded-lg border border-theme bg-surface px-3 py-2.5 text-sm text-primary focus:border-emerald-500 focus:outline-none focus-ring transition-colors">
                                <option value="general">📋 Général</option>
                                <option value="bug">🐛 Bug / Problème technique</option>
                                <option value="billing">💳 Facturation</option>
                                <option value="feature_request">✨ Demande de fonctionnalité</option>
                                <option value="account">👤 Compte</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-secondary mb-1.5">Priorité</label>
                            <select value={data.priority} onChange={e => setData('priority', e.target.value)}
                                className="w-full rounded-lg border border-theme bg-surface px-3 py-2.5 text-sm text-primary focus:border-emerald-500 focus:outline-none focus-ring transition-colors">
                                <option value="low">🟢 Basse</option>
                                <option value="medium">🔵 Moyenne</option>
                                <option value="high">🟠 Haute</option>
                                <option value="urgent">🔴 Urgente</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-secondary mb-1.5">
                            <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                Description *
                            </span>
                        </label>
                        <textarea value={data.body} onChange={e => setData('body', e.target.value)} rows={5}
                            placeholder="Décrivez votre problème en détail..."
                            className="w-full rounded-lg border border-theme bg-subtle px-3 py-2.5 text-sm text-primary placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus-ring resize-none transition-colors" />
                        {errors.body && <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>{errors.body}</p>}
                        <p className="mt-1 text-xs text-muted">{data.body.length}/5000 caractères</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-theme pt-4">
                        <Link href={route('client.tickets.index')} className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-[var(--bg-subtle)] transition-all btn-press">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            Annuler
                        </Link>
                        <button type="submit" disabled={processing || !data.subject.trim() || !data.body.trim()}
                            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-primary hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-press focus-ring shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                            {processing ? <Spinner /> : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                            {processing ? 'Envoi en cours...' : 'Envoyer le ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
