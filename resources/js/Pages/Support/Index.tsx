import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData, SupportTicket } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';

type Props = PageProps<{
    tickets: PaginatedData<SupportTicket>;
}>;

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
const priorityIcon: Record<string, string> = {
    low: '🟢', medium: '🔵', high: '🟠', urgent: '🔴',
};

export default function ClientSupportIndex({ tickets }: Props) {
    useEffect(() => {
        const id = setInterval(() => router.reload({ only: ['tickets'] }), 5000);
        return () => clearInterval(id);
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Support" />
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                            <svg className="h-5 w-5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-primary">Support</h1>
                            <p className="text-sm text-secondary">Gérez vos demandes d'assistance</p>
                        </div>
                    </div>
                    <Link href={route('client.tickets.create')}
                        className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-primary hover:bg-emerald-600 transition-all btn-press focus-ring shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nouveau ticket
                    </Link>
                </div>

                {tickets.data.length === 0 ? (
                    <div className="rounded-xl border border-theme bg-surface py-14 text-center animate-slide-up">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-subtle mb-4">
                            <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-primary">Vous n'avez aucun ticket de support</p>
                        <p className="mt-1 text-xs text-muted">Créez un ticket pour obtenir de l'aide de notre équipe.</p>
                        <Link href={route('client.tickets.create')} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Créer mon premier ticket
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2 stagger">
                        {tickets.data.map(ticket => (
                            <Link key={ticket.id} href={route('client.tickets.show', ticket.id)}
                                className="group flex items-center justify-between rounded-xl border border-theme bg-surface px-4 py-3.5 hover:bg-[var(--bg-subtle)] hover:border-[var(--border)] transition-all animate-fade-in">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm">{priorityIcon[ticket.priority] ?? '⚪'}</span>
                                        <span className="font-mono text-xs text-muted">{ticket.ticket_number}</span>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[ticket.status]}`}>
                                            {statusLabel[ticket.status]}
                                        </span>
                                        {ticket.messages_count && ticket.messages_count > 0 && (
                                            <span className="flex items-center gap-1 text-xs text-muted">
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                                {ticket.messages_count}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-primary truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{ticket.subject}</p>
                                    <p className="text-xs text-muted">{new Date(ticket.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <svg className="ml-3 h-4 w-4 flex-shrink-0 text-muted group-hover:text-emerald-500 transition-all group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {tickets.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {tickets.links.map((l, i) => (
                            l.url ? (
                                <Link key={i} href={l.url}
                                    className={`rounded-lg px-3 py-1.5 text-sm transition-all btn-press ${l.active ? 'bg-emerald-500 text-primary shadow-lg shadow-emerald-500/20' : 'bg-gray-100 dark:bg-subtle text-secondary hover:bg-gray-200 dark:hover:bg-subtle'}`}
                                    dangerouslySetInnerHTML={{ __html: l.label }} />
                            ) : (
                                <span key={i} className="rounded-lg px-3 py-1.5 text-sm text-muted" dangerouslySetInnerHTML={{ __html: l.label }} />
                            )
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
