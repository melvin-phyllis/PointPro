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
    open: 'Ouvert', in_progress: 'En cours', waiting_customer: 'Réponse attendue',
    resolved: 'Résolu', closed: 'Fermé',
};

export default function ClientSupportShow({ ticket }: Props) {
    const { data, setData, post, processing, reset } = useForm({ body: '' });

    // Auto-refresh toutes les 5s
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
            <div className="mx-auto max-w-2xl space-y-6">

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href={route('client.tickets.index')} className="hover:text-emerald-400">Support</Link>
                    <span>/</span><span className="text-gray-200">{ticket.ticket_number}</span>
                </div>

                {/* En-tête */}
                <div className="rounded-xl border border-white/10 bg-[#0D1117] p-6 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h1 className="text-lg font-bold text-white">{ticket.subject}</h1>
                            <p className="text-xs text-gray-500">{ticket.ticket_number} · {ticket.category} · {new Date(ticket.created_at).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[ticket.status]}`}>
                            {statusLabel[ticket.status]}
                        </span>
                    </div>
                </div>

                {/* Messages */}
                <div className="space-y-3">
                    {ticket.messages?.filter(m => !m.is_internal_note).map(msg => (
                        <div key={msg.id} className={`rounded-xl border p-4 ${msg.user?.role === 'super_admin'
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
                                        <p className="text-xs text-gray-500">{msg.user?.role === 'super_admin' ? 'Équipe PointPro' : 'Vous'}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString('fr-FR')}</span>
                            </div>
                            <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.body}</p>
                        </div>
                    ))}
                </div>

                {/* Répondre */}
                {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
                    <form onSubmit={submitReply} className="rounded-xl border border-white/10 bg-[#0D1117] p-4 space-y-3">
                        <textarea value={data.body} onChange={e => setData('body', e.target.value)}
                            rows={3} placeholder="Votre réponse..."
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:outline-none resize-none" />
                        <div className="flex justify-end">
                            <button type="submit" disabled={processing || !data.body.trim()}
                                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50 transition">
                                {processing ? 'Envoi...' : 'Répondre'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Ticket résolu/fermé */}
                {(ticket.status === 'closed' || ticket.status === 'resolved') && (
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                        <p className="text-sm text-gray-400">
                            Ce ticket est {ticket.status === 'closed' ? 'fermé' : 'résolu'}.
                            {' '}<Link href={route('client.tickets.create')} className="text-emerald-400 hover:underline">Créer un nouveau ticket</Link>
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
