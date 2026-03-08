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
    resolved: 'bg-gray-500/20 text-muted',
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

    useEffect(() => {
        const id = setInterval(() => router.reload({ only: ['tickets', 'stats'] }), 5000);
        return () => clearInterval(id);
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Support" />
            <div className="space-y-6 animate-fade-in">

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                        <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-primary">Support — Tickets</h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 stagger">
                    {[
                        { label: 'Ouverts', value: stats.open_count, color: 'text-emerald-400', icon: '📬' },
                        { label: 'En cours', value: stats.in_progress_count, color: 'text-blue-400', icon: '🔄' },
                        { label: 'Résolus aujourd\'hui', value: stats.resolved_today, color: 'text-muted', icon: '✅' },
                        { label: 'Urgents', value: stats.urgent_open, color: stats.urgent_open > 0 ? 'text-red-400' : 'text-muted', icon: stats.urgent_open > 0 ? '🚨' : '🔕' },
                    ].map(s => (
                        <div key={s.label} className={`rounded-xl border border-theme bg-surface p-4 text-center animate-fade-in hover:border-white/20 transition-all ${s.value > 0 && s.label === 'Urgents' ? 'animate-glow' : ''}`}>
                            <div className="text-lg mb-1">{s.icon}</div>
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filtres */}
                <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" placeholder="Rechercher (sujet, n° ticket)..."
                            value={data.search} onChange={e => setData('search', e.target.value)}
                            className="w-full rounded-lg border border-theme bg-subtle pl-10 pr-3 py-2.5 text-sm text-primary placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus-ring transition-colors" />
                    </div>
                    <select value={data.status} onChange={e => setData('status', e.target.value)}
                        className="rounded-lg border border-theme bg-surface px-3 py-2.5 text-sm text-primary focus:border-emerald-500 focus:outline-none focus-ring transition-colors">
                        <option value="">Tous les statuts</option>
                        <option value="open">📬 Ouverts</option>
                        <option value="in_progress">🔄 En cours</option>
                        <option value="waiting_customer">⏳ Attente client</option>
                        <option value="resolved">✅ Résolus</option>
                        <option value="closed">🔒 Fermés</option>
                    </select>
                    <select value={data.priority} onChange={e => setData('priority', e.target.value)}
                        className="rounded-lg border border-theme bg-surface px-3 py-2.5 text-sm text-primary focus:border-emerald-500 focus:outline-none focus-ring transition-colors">
                        <option value="">Toutes priorités</option>
                        <option value="low">🟢 Basse</option>
                        <option value="medium">🔵 Moyenne</option>
                        <option value="high">🟠 Haute</option>
                        <option value="urgent">🔴 Urgente</option>
                    </select>
                    <button type="submit" className="flex items-center gap-2 rounded-lg bg-subtle px-4 py-2.5 text-sm text-primary hover:bg-white/20 transition-all btn-press focus-ring">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        Filtrer
                    </button>
                </form>

                {/* Liste */}
                <div className="space-y-2 stagger">
                    {tickets.data.length === 0 && (
                        <div className="rounded-xl border border-theme bg-surface py-12 text-center animate-fade-in">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-subtle mb-3">
                                <svg className="h-7 w-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                            </div>
                            <p className="text-sm text-muted">Aucun ticket trouvé</p>
                            <p className="text-xs text-gray-600 mt-1">Essayez de modifier vos filtres</p>
                        </div>
                    )}
                    {tickets.data.map(ticket => (
                        <Link key={ticket.id} href={route('admin.tickets.show', ticket.id)}
                            className="group flex items-center justify-between rounded-xl border border-theme bg-surface px-4 py-3.5 hover:bg-white/[0.03] hover:border-white/20 transition-all animate-fade-in">
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
                                <p className="mt-1 text-sm font-medium text-primary truncate group-hover:text-primary transition-colors">{ticket.subject}</p>
                                <p className="text-xs text-gray-500">
                                    {ticket.company?.name} · {ticket.user?.full_name} · {categoryLabel[ticket.category] ?? ticket.category} · {new Date(ticket.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                </p>
                            </div>
                            <svg className="ml-3 h-4 w-4 flex-shrink-0 text-gray-600 group-hover:text-emerald-400 transition-all group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                    className={`rounded-lg px-3 py-1.5 text-sm transition-all btn-press ${l.active ? 'bg-emerald-500 text-primary shadow-lg shadow-emerald-500/20' : 'bg-subtle text-muted hover:bg-subtle'}`}
                                    dangerouslySetInnerHTML={{ __html: l.label }} />
                            ) : (
                                <span key={i} className="rounded-lg px-3 py-1.5 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: l.label }} />
                            )
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
