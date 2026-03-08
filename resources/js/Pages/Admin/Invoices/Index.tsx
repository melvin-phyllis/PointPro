import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Invoice, PageProps, PaginatedData } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Props = PageProps<{
    invoices: PaginatedData<Invoice>;
    filters: { search?: string; status?: string };
}>;

const statusBadge: Record<string, string> = {
    draft: 'bg-gray-500/20 text-muted',
    sent: 'bg-blue-500/20 text-blue-400',
    paid: 'bg-emerald-500/20 text-emerald-400',
    overdue: 'bg-red-500/20 text-red-400',
    cancelled: 'bg-gray-500/20 text-gray-500',
};
const statusLabel: Record<string, string> = {
    draft: 'Brouillon', sent: 'Envoyée', paid: 'Payée', overdue: 'En retard', cancelled: 'Annulée',
};

function fmt(n: number) { return new Intl.NumberFormat('fr-FR').format(n); }

export default function InvoicesIndex({ invoices, filters }: Props) {
    const { data, setData, get } = useForm({
        search: filters.search ?? '', status: filters.status ?? '',
    });

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        get(route('admin.invoices.index'), { preserveState: true });
    }

    function sendInvoice(id: number) {
        router.post(route('admin.invoices.send', id));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Factures" />
            <div className="space-y-6">

                <div>
                    <h1 className="text-xl font-bold text-primary">Factures</h1>
                    <p className="text-sm text-muted">{invoices.total} facture(s)</p>
                </div>

                {/* Filtres */}
                <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
                    <input type="text" placeholder="Rechercher (n° facture, entreprise)..."
                        value={data.search} onChange={e => setData('search', e.target.value)}
                        className="flex-1 min-w-[200px] rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
                    <select value={data.status} onChange={e => setData('status', e.target.value)}
                        className="rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none">
                        <option value="">Tous les statuts</option>
                        <option value="draft">Brouillon</option>
                        <option value="sent">Envoyée</option>
                        <option value="paid">Payée</option>
                        <option value="overdue">En retard</option>
                    </select>
                    <button type="submit" className="rounded-lg bg-subtle px-4 py-2 text-sm text-primary hover:bg-white/20 transition">Filtrer</button>
                </form>

                {/* Tableau */}
                <div className="overflow-hidden rounded-xl border border-theme bg-surface">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-theme">
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">N° Facture</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Entreprise</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Montant</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">Échéance</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {invoices.data.length === 0 && (
                                <tr><td colSpan={6} className="py-10 text-center text-sm text-gray-500">Aucune facture</td></tr>
                            )}
                            {invoices.data.map(inv => (
                                <tr key={inv.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3 text-sm font-mono text-primary">{inv.invoice_number}</td>
                                    <td className="px-4 py-3 text-sm text-secondary">{inv.company?.name ?? '—'}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-emerald-400">{fmt(inv.total_amount)} FCFA</td>
                                    <td className="hidden px-4 py-3 text-xs text-gray-500 md:table-cell">
                                        {new Date(inv.due_date).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[inv.status] ?? 'bg-gray-500/20 text-muted'}`}>
                                            {statusLabel[inv.status] ?? inv.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {inv.status === 'draft' && (
                                            <button onClick={() => sendInvoice(inv.id)} className="text-xs text-emerald-400 hover:underline">Marquer envoyée</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {invoices.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {invoices.links.map((l, i) => (
                            l.url ? (
                                <Link key={i} href={l.url}
                                    className={`rounded px-3 py-1 text-sm transition ${l.active ? 'bg-emerald-500 text-primary' : 'bg-subtle text-muted hover:bg-subtle'}`}
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
