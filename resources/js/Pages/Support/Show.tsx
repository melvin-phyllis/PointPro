import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, SupportTicket } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

type Props = PageProps<{ ticket: SupportTicket }>;

const statusBadge: Record<string, string> = {
    open: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    in_progress: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    waiting_customer: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
    resolved: 'bg-gray-500/20 text-secondary',
    closed: 'bg-gray-500/20 text-muted',
};
const statusLabel: Record<string, string> = {
    open: 'Ouvert', in_progress: 'En cours', waiting_customer: 'Réponse attendue',
    resolved: 'Résolu', closed: 'Fermé',
};

const Spinner = () => (
    <svg className="h-4 w-4 animate-spin-slow" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
);

export default function ClientSupportShow({ ticket }: Props) {
    const { data, setData, post, processing, reset } = useForm({ body: '' });

    useEffect(() => {
        const id = setInterval(() => router.reload({ only: ['ticket'] }), 3000);
        return () => clearInterval(id);
    }, [ticket.id]);

    function submitReply(e: FormEvent) {
        e.preventDefault();
        post(route('client.tickets.reply', ticket.id), { onSuccess: () => reset() });
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Ticket ${ticket.ticket_number}`} />
            <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted">
                    <Link href={route('client.tickets.index')} className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Support
                    </Link>
                    <span className="text-muted">/</span>
                    <span className="text-primary">{ticket.ticket_number}</span>
                </div>

                {/* En-tête */}
                <div className="rounded-xl border border-theme bg-surface p-6 space-y-3 animate-slide-up">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 mt-0.5">
                                <svg className="h-5 w-5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-primary">{ticket.subject}</h1>
                                <p className="text-xs text-muted mt-0.5">
                                    {ticket.ticket_number} · {ticket.category} · {new Date(ticket.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[ticket.status]}`}>
                            {statusLabel[ticket.status]}
                        </span>
                    </div>
                </div>

                {/* Messages */}
                <div className="space-y-3 stagger">
                    {ticket.messages?.filter(m => !m.is_internal_note).map(msg => (
                        <div key={msg.id} className={`rounded-xl border p-4 animate-fade-in ${msg.user?.role === 'super_admin'
                            ? 'border-emerald-500/20 bg-emerald-500/5'
                            : 'border-theme bg-surface'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${msg.user?.role === 'super_admin'
                                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-subtle text-primary'
                                        }`}>
                                        {(msg.user?.full_name ?? '?')[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-primary">{msg.user?.full_name ?? 'Utilisateur'}</p>
                                        <p className="text-xs text-muted">{msg.user?.role === 'super_admin' ? '✨ Équipe PointPro' : 'Vous'}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-muted">{new Date(msg.created_at).toLocaleString('fr-FR')}</span>
                            </div>
                            <p className="text-sm text-secondary whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                        </div>
                    ))}
                </div>

                {/* Formulaire réponse */}
                {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
                    <form onSubmit={submitReply} className="rounded-xl border border-theme bg-surface p-4 space-y-3 animate-slide-up">
                        <div className="flex items-center gap-2 text-xs text-muted mb-1">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                            Répondre à ce ticket
                        </div>
                        <textarea value={data.body} onChange={e => setData('body', e.target.value)}
                            rows={3} placeholder="Écrivez votre réponse..."
                            className="w-full rounded-lg border border-theme bg-subtle px-3 py-2.5 text-sm text-primary placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus-ring resize-none transition-colors" />
                        <div className="flex justify-end">
                            <button type="submit" disabled={processing || !data.body.trim()}
                                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-primary hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-press focus-ring shadow-lg shadow-emerald-500/20">
                                {processing ? <Spinner /> : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                                {processing ? 'Envoi...' : 'Répondre'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Ticket fermé/résolu */}
                {(ticket.status === 'closed' || ticket.status === 'resolved') && (
                    <div className="rounded-xl border border-theme bg-subtle p-5 text-center animate-slide-up">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-subtle mb-3">
                            <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-sm text-secondary">
                            Ce ticket est {ticket.status === 'closed' ? 'fermé' : 'résolu'}.
                        </p>
                        <Link href={route('client.tickets.create')} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all btn-press">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Créer un nouveau ticket
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
