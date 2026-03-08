import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, SupportTicket } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

type Props = PageProps<{ ticket: SupportTicket }>;

const statusBadge: Record<string, string> = {
    open: 'bg-emerald-500/20 text-emerald-400', in_progress: 'bg-blue-500/20 text-blue-400',
    waiting_customer: 'bg-amber-500/20 text-amber-400', resolved: 'bg-gray-500/20 text-muted',
    closed: 'bg-gray-500/20 text-gray-500',
};
const statusLabel: Record<string, string> = {
    open: 'Ouvert', in_progress: 'En cours', waiting_customer: 'Attente client',
    resolved: 'Résolu', closed: 'Fermé',
};
const priorityBadge: Record<string, string> = {
    low: 'bg-gray-500/20 text-muted', medium: 'bg-blue-500/20 text-blue-400',
    high: 'bg-amber-500/20 text-amber-400', urgent: 'bg-red-500/20 text-red-400',
};

const Spinner = () => (
    <svg className="h-4 w-4 animate-spin-slow" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
);

export default function SupportShow({ ticket }: Props) {
    const { data, setData, post, processing, reset } = useForm({ body: '', is_internal_note: false });

    useEffect(() => {
        const id = setInterval(() => router.reload({ only: ['ticket'] }), 3000);
        return () => clearInterval(id);
    }, [ticket.id]);

    function submitReply(e: FormEvent) {
        e.preventDefault();
        post(route('admin.tickets.reply', ticket.id), { onSuccess: () => reset() });
    }

    function closeTicket() {
        if (confirm('Êtes-vous sûr de vouloir fermer ce ticket ?')) {
            router.post(route('admin.tickets.close', ticket.id));
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Ticket ${ticket.ticket_number}`} />
            <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href={route('admin.tickets.index')} className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Support
                    </Link>
                    <span className="text-gray-600">/</span>
                    <span className="text-primary">{ticket.ticket_number}</span>
                </div>

                {/* En-tête ticket */}
                <div className="rounded-xl border border-theme bg-surface p-6 space-y-4 animate-slide-up">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 mt-0.5">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-primary">{ticket.subject}</h1>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {ticket.ticket_number} · {ticket.company?.name} · {ticket.user?.full_name}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[ticket.status]}`}>
                                {statusLabel[ticket.status]}
                            </span>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadge[ticket.priority]}`}>
                                {ticket.priority}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                        <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                            <span className="text-gray-500">Catégorie</span>
                            <p className="text-secondary font-medium mt-0.5">{ticket.category}</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                            <span className="text-gray-500">Créé le</span>
                            <p className="text-secondary font-medium mt-0.5">{new Date(ticket.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                            <span className="text-gray-500">Assigné à</span>
                            <p className="text-secondary font-medium mt-0.5">{ticket.assigned_to_user?.full_name ?? '—'}</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                            <span className="text-gray-500">Résolu le</span>
                            <p className="text-secondary font-medium mt-0.5">{ticket.resolved_at ? new Date(ticket.resolved_at).toLocaleDateString('fr-FR') : '—'}</p>
                        </div>
                    </div>
                    {ticket.status !== 'closed' && (
                        <div className="flex gap-2 pt-1">
                            <button onClick={closeTicket} className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-all btn-press focus-ring">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                Fermer le ticket
                            </button>
                        </div>
                    )}
                </div>

                {/* Messages */}
                <div className="space-y-3 stagger">
                    {ticket.messages?.map(msg => (
                        <div key={msg.id} className={`rounded-xl border p-4 animate-fade-in ${msg.is_internal_note
                            ? 'border-amber-500/20 bg-amber-500/5'
                            : msg.user?.role === 'super_admin'
                                ? 'border-emerald-500/20 bg-emerald-500/5'
                                : 'border-theme bg-surface'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${msg.user?.role === 'super_admin' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-subtle text-secondary'
                                        }`}>
                                        {(msg.user?.full_name ?? '?')[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-primary">{msg.user?.full_name ?? 'Utilisateur'}</p>
                                        <p className="text-xs text-gray-500">{msg.user?.role === 'super_admin' ? '✨ Support PointPro' : '👤 Client'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {msg.is_internal_note && (
                                        <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            Note interne
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString('fr-FR')}</span>
                                </div>
                            </div>
                            <p className="text-sm text-secondary whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                        </div>
                    ))}
                </div>

                {/* Formulaire de réponse */}
                {ticket.status !== 'closed' && (
                    <form onSubmit={submitReply} className="rounded-xl border border-theme bg-surface p-4 space-y-3 animate-slide-up">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                            Répondre au ticket
                        </div>
                        <textarea value={data.body} onChange={e => setData('body', e.target.value)}
                            rows={3} placeholder="Votre réponse..."
                            className="w-full rounded-lg border border-theme bg-subtle px-3 py-2.5 text-sm text-primary placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus-ring resize-none transition-colors" />
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={data.is_internal_note} onChange={e => setData('is_internal_note', e.target.checked)} className="accent-amber-500 rounded" />
                                <span className="flex items-center gap-1.5 text-xs text-muted group-hover:text-secondary transition-colors">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    Note interne (invisible pour le client)
                                </span>
                            </label>
                            <button type="submit" disabled={processing || !data.body.trim()}
                                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-primary hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-press focus-ring shadow-lg shadow-emerald-500/20">
                                {processing ? <Spinner /> : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                                {processing ? 'Envoi...' : 'Répondre'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
