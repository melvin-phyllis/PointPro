import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData, SupportTicket } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';

type Props = PageProps<{
    tickets: PaginatedData<SupportTicket>;
}>;

const statusBadge: Record<string, string> = {
    open: 'bg-emerald-500/20 text-emerald-400', in_progress: 'bg-blue-500/20 text-blue-400',
    waiting_customer: 'bg-amber-500/20 text-amber-400', resolved: 'bg-gray-500/20 text-gray-400',
    closed: 'bg-gray-500/20 text-gray-500',
};
const statusLabel: Record<string, string> = {
    open: 'Ouvert', in_progress: 'En cours', waiting_customer: 'Réponse attendue',
    resolved: 'Résolu', closed: 'Fermé',
};

export default function ClientSupportIndex({ tickets }: Props) {
    // Auto-refresh toutes les 15s
    useEffect(() => {
        const id = setInterval(() => router.reload({ only: ['tickets'] }), 5000);
        return () => clearInterval(id);
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Support" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Support</h1>
                        <p className="text-sm text-gray-400">Gérez vos demandes d'assistance</p>
                    </div>
                    <Link href={route('client.tickets.create')}
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition">
                        + Nouveau ticket
                    </Link>
                </div>

                {tickets.data.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-[#0D1117] py-12 text-center">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/5 mb-3">
                            <svg className="h-7 w-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-400">Vous n'avez aucun ticket de support.</p>
                        <p className="mt-1 text-xs text-gray-500">Créez un ticket pour obtenir de l'aide.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {tickets.data.map(ticket => (
                            <Link key={ticket.id} href={route('client.tickets.show', ticket.id)}
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0D1117] px-4 py-3 hover:bg-white/[0.03] transition">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs text-gray-500">{ticket.ticket_number}</span>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[ticket.status]}`}>
                                            {statusLabel[ticket.status]}
                                        </span>
                                        {ticket.messages_count && ticket.messages_count > 0 && (
                                            <span className="text-xs text-gray-500">{ticket.messages_count} message(s)</span>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-gray-200 truncate">{ticket.subject}</p>
                                    <p className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <svg className="ml-3 h-4 w-4 flex-shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                    className={`rounded px-3 py-1 text-sm transition ${l.active ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    dangerouslySetInnerHTML={{ __html: l.label }} />
                            ) : (
                                <span key={i} className="rounded px-3 py-1 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: l.label }} />
                            )
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
