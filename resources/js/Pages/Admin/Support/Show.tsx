import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, SupportTicket } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

type Props = PageProps<{ ticket: SupportTicket }>;

const statusBadge: Record<string, string> = {
    open: 'bg-emerald-500/20 text-emerald-400', in_progress: 'bg-blue-500/20 text-blue-400',
    waiting_customer: 'bg-amber-500/20 text-amber-400', resolved: 'bg-gray-500/20 text-gray-400',
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

export default function SupportShow({ ticket }: Props) {
    const { data, setData, post, processing, reset } = useForm({ body: '', is_internal_note: false });

    // Auto-refresh toutes les 5s
    useEffect(() => {
        const id = setInterval(() => router.reload({ only: ['ticket'] }), 3000);
        return () => clearInterval(id);
    }, [ticket.id]);

    function submitReply(e: FormEvent) {
        e.preventDefault();
        post(route('admin.tickets.reply', ticket.id), { onSuccess: () => reset() });
    }

    function closeTicket() {
        if (confirm('Fermer ce ticket ?')) router.post(route('admin.tickets.close', ticket.id));
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Ticket ${ticket.ticket_number}`} />
            <div className="mx-auto max-w-2xl space-y-6">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href={route('admin.tickets.index')} className="hover:text-emerald-400">Support</Link>
                    <span>/</span><span className="text-gray-200">{ticket.ticket_number}</span>
                </div>

                {/* En-tête ticket */}
                <div className="rounded-xl border border-white/10 bg-[#0D1117] p-6 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h1 className="text-lg font-bold text-white">{ticket.subject}</h1>
                            <p className="text-xs text-gray-500">
                                {ticket.ticket_number} · {ticket.company?.name} · {ticket.user?.full_name}
                            </p>
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
                        <div><span className="text-gray-500">Catégorie</span><p className="text-gray-300">{ticket.category}</p></div>
                        <div><span className="text-gray-500">Créé le</span><p className="text-gray-300">{new Date(ticket.created_at).toLocaleDateString('fr-FR')}</p></div>
                        <div><span className="text-gray-500">Assigné à</span><p className="text-gray-300">{ticket.assigned_to_user?.full_name ?? '—'}</p></div>
                        <div><span className="text-gray-500">Résolu le</span><p className="text-gray-300">{ticket.resolved_at ? new Date(ticket.resolved_at).toLocaleDateString('fr-FR') : '—'}</p></div>
                    </div>
                    {ticket.status !== 'closed' && (
                        <div className="flex gap-2 pt-2">
                            <button onClick={closeTicket} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition">
                                Fermer le ticket
                            </button>
                        </div>
                    )}
                </div>

                {/* Messages */}
                <div className="space-y-3">
                    {ticket.messages?.map(msg => (
                        <div key={msg.id} className={`rounded-xl border p-4 ${msg.is_internal_note
                            ? 'border-amber-500/20 bg-amber-500/5'
                            : msg.user?.role === 'super_admin'
                                ? 'border-emerald-500/20 bg-emerald-500/5'
                                : 'border-white/10 bg-[#0D1117]'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${msg.user?.role === 'super_admin' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-300'
                                        }`}>
                                        {(msg.user?.full_name ?? '?')[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">{msg.user?.full_name ?? 'Utilisateur'}</p>
                                        <p className="text-xs text-gray-500">{msg.user?.role === 'super_admin' ? 'Support PointPro' : 'Client'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {msg.is_internal_note && (
                                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">Note interne</span>
                                    )}
                                    <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString('fr-FR')}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.body}</p>
                        </div>
                    ))}
                </div>

                {/* Formulaire de réponse */}
                {ticket.status !== 'closed' && (
                    <form onSubmit={submitReply} className="rounded-xl border border-white/10 bg-[#0D1117] p-4 space-y-3">
                        <textarea value={data.body} onChange={e => setData('body', e.target.value)}
                            rows={3} placeholder="Votre réponse..."
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:outline-none resize-none" />
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.is_internal_note} onChange={e => setData('is_internal_note', e.target.checked)} className="accent-amber-500" />
                                <span className="text-xs text-gray-400">Note interne (invisible pour le client)</span>
                            </label>
                            <button type="submit" disabled={processing || !data.body.trim()}
                                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50 transition">
                                {processing ? 'Envoi...' : 'Répondre'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
