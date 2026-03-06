import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData, SupportTicket } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

type Props = PageProps<{
    tickets: PaginatedData<SupportTicket>;
    stats: { open_count: number; in_progress_count: number; resolved_today: number; urgent_open: number };
    filters: { status?: string; priority?: string; search?: string };
}>;

const statusBadge: Record<string, string> = {
    open: 'bg-emerald-500/20 text-emerald-400',
    in_progress: 'bg-blue-500/20 text-blue-400',
    waiting_customer: 'bg-amber-500/20 text-amber-400',
    resolved: 'bg-gray-500/20 text-gray-400',
    closed: 'bg-gray-500/20 text-gray-500',
};
const statusLabel: Record<string, string> = {
    open: 'Ouvert', in_progress: 'En cours', waiting_customer: 'Attente client',
    resolved: 'Résolu', closed: 'Fermé',
};
const priorityBadge: Record<string, string> = {
    low: 'bg-gray-500/20 text-gray-400', medium: 'bg-blue-500/20 text-blue-400',
    high: 'bg-amber-500/20 text-amber-400', urgent: 'bg-red-500/20 text-red-400',
};
const categoryLabel: Record<string, string> = {
    bug: '🐛 Bug', billing: '💳 Facturation', feature_request: '✨ Demande',
    account: '👤 Compte', general: '📋 Général',
};

export default function SupportIndex({ tickets, stats, filters }: Props) {
    const { data, setData, get } = useForm({
        search: filters.search ?? '', status: filters.status ?? '', priority: filters.priority ?? '',
    });

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        get(route('admin.tickets.index'), { preserveState: true });
    }

    // Auto-refresh toutes les 10s
    useEffect(() => {
        const id = setInterval(() => router.reload({ only: ['tickets', 'stats'] }), 5000);
        return () => clearInterval(id);
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Support" />
            <div className="space-y-6">

                <h1 className="text-xl font-bold text-white">Support — Tickets</h1>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { label: 'Ouverts', value: stats.open_count, color: 'text-emerald-400' },
                        { label: 'En cours', value: stats.in_progress_count, color: 'text-blue-400' },
                        { label: 'Résolus aujourd\'hui', value: stats.resolved_today, color: 'text-gray-400' },
                        { label: 'Urgents', value: stats.urgent_open, color: stats.urgent_open > 0 ? 'text-red-400' : 'text-gray-400' },
                    ].map(s => (
                        <div key={s.label} className="rounded-xl border border-white/10 bg-[#0D1117] p-4 text-center">
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filtres */}
                <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
                    <input type="text" placeholder="Rechercher (sujet, n° ticket)..."
                        value={data.search} onChange={e => setData('search', e.target.value)}
                        className="flex-1 min-w-[200px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
                    <select value={data.status} onChange={e => setData('status', e.target.value)}
                        className="rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                        <option value="">Tous les statuts</option>
                        <option value="open">Ouverts</option>
                        <option value="in_progress">En cours</option>
                        <option value="waiting_customer">Attente client</option>
                        <option value="resolved">Résolus</option>
                        <option value="closed">Fermés</option>
                    </select>
                    <select value={data.priority} onChange={e => setData('priority', e.target.value)}
                        className="rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                        <option value="">Toutes priorités</option>
                        <option value="low">Basse</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                        <option value="urgent">Urgente</option>
                    </select>
                    <button type="submit" className="rounded-lg bg-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/20 transition">Filtrer</button>
                </form>

                {/* Liste */}
                <div className="space-y-2">
                    {tickets.data.length === 0 && (
                        <div className="rounded-xl border border-white/10 bg-[#0D1117] py-10 text-center text-sm text-gray-500">Aucun ticket</div>
                    )}
                    {tickets.data.map(ticket => (
                        <Link key={ticket.id} href={route('admin.tickets.show', ticket.id)}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0D1117] px-4 py-3 hover:bg-white/[0.03] transition">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs text-gray-500">{ticket.ticket_number}</span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[ticket.status]}`}>
                                        {statusLabel[ticket.status]}
                                    </span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadge[ticket.priority]}`}>
                                        {ticket.priority}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm font-medium text-gray-200 truncate">{ticket.subject}</p>
                                <p className="text-xs text-gray-500">
                                    {ticket.company?.name} · {ticket.user?.full_name} · {categoryLabel[ticket.category] ?? ticket.category} · {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                            <svg className="ml-3 h-4 w-4 flex-shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </div>

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
