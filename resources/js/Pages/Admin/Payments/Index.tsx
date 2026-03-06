import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData, Payment } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

type Props = PageProps<{
    payments: PaginatedData<Payment>;
    total_revenue: number;
    filters: { search?: string; status?: string; method?: string };
}>;

const statusBadge: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-400',
    pending: 'bg-amber-500/20 text-amber-400',
    failed: 'bg-red-500/20 text-red-400',
    refunded: 'bg-blue-500/20 text-blue-400',
    cancelled: 'bg-gray-500/20 text-gray-400',
};

const methodLabels: Record<string, string> = {
    mobile_money: 'Mobile Money', wave: 'Wave', cinetpay: 'CinetPay',
    fedapay: 'FedaPay', bank_transfer: 'Virement', cash: 'Espèces', other: 'Autre',
};

function fmt(n: number) { return new Intl.NumberFormat('fr-FR').format(n); }

export default function PaymentsIndex({ payments, total_revenue, filters }: Props) {
    const { data, setData, get } = useForm({
        search: filters.search ?? '', status: filters.status ?? '', method: filters.method ?? '',
    });

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        get(route('admin.payments.index'), { preserveState: true });
    }

    // Auto-refresh toutes les 30s
    useEffect(() => {
        const id = setInterval(() => router.reload({ only: ['payments', 'total_revenue'] }), 10000);
        return () => clearInterval(id);
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Paiements" />
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-white">Paiements</h1>
                        <p className="text-sm text-gray-400">
                            {payments.total} paiement(s) — Revenus totaux : <span className="font-semibold text-emerald-400">{fmt(total_revenue)} FCFA</span>
                        </p>
                    </div>
                    <Link href={route('admin.payments.create')}
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition">
                        + Paiement manuel
                    </Link>
                </div>

                {/* Filtres */}
                <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
                    <input type="text" placeholder="Rechercher entreprise..."
                        value={data.search} onChange={e => setData('search', e.target.value)}
                        className="flex-1 min-w-[200px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
                    <select value={data.status} onChange={e => setData('status', e.target.value)}
                        className="rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                        <option value="">Tous les statuts</option>
                        <option value="completed">Complété</option>
                        <option value="pending">En attente</option>
                        <option value="failed">Échoué</option>
                    </select>
                    <select value={data.method} onChange={e => setData('method', e.target.value)}
                        className="rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                        <option value="">Toutes les méthodes</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="wave">Wave</option>
                        <option value="bank_transfer">Virement</option>
                        <option value="cash">Espèces</option>
                    </select>
                    <button type="submit" className="rounded-lg bg-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/20 transition">Filtrer</button>
                </form>

                {/* Tableau */}
                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0D1117]">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Entreprise</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Montant</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell">Méthode</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">Plan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">Date</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {payments.data.length === 0 && (
                                <tr><td colSpan={7} className="py-10 text-center text-sm text-gray-500">Aucun paiement trouvé</td></tr>
                            )}
                            {payments.data.map(p => (
                                <tr key={p.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-gray-200">{p.company?.name ?? '—'}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-emerald-400">{fmt(p.amount)} FCFA</td>
                                    <td className="hidden px-4 py-3 text-sm text-gray-400 sm:table-cell">{methodLabels[p.payment_method] ?? p.payment_method}</td>
                                    <td className="hidden px-4 py-3 text-sm text-gray-400 md:table-cell">{p.subscription?.plan?.name ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[p.status] ?? 'bg-gray-500/20 text-gray-400'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="hidden px-4 py-3 text-xs text-gray-500 md:table-cell">
                                        {p.paid_at ? new Date(p.paid_at).toLocaleDateString('fr-FR') : new Date(p.created_at).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link href={route('admin.payments.show', p.id)} className="text-xs text-emerald-400 hover:underline">Détails</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {payments.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {payments.links.map((l, i) => (
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
