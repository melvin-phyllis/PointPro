import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export interface QuoteRequestItem {
    id: number;
    company_name: string;
    plan: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    message: string | null;
    company_id: number | null;
    created_at: string;
    company?: { id: number; name: string } | null;
}

type Props = PageProps<{
    quoteRequests: PaginatedData<QuoteRequestItem>;
    filters: { search?: string; plan?: string };
}>;

const planBadge: Record<string, string> = {
    starter: 'bg-gray-500/20 text-muted',
    business: 'bg-blue-500/20 text-blue-400',
    enterprise: 'bg-emerald-500/20 text-emerald-400',
};

const planLabel: Record<string, string> = {
    starter: 'Starter',
    business: 'Business',
    enterprise: 'Enterprise',
};

export default function QuoteRequestsIndex({ quoteRequests, filters }: Props) {
    const { data, setData, get } = useForm({
        search: filters.search ?? '',
        plan: filters.plan ?? '',
    });

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        get(route('admin.quote-requests.index'), { preserveState: true });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Demandes de devis" />
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-primary">Demandes de devis</h1>
                        <p className="text-sm text-muted">{quoteRequests.total} demande(s)</p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Entreprise, email, nom..."
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        className="min-w-[200px] flex-1 rounded-lg border border-theme bg-subtle px-3 py-2 text-sm text-primary placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                    />
                    <select
                        value={data.plan}
                        onChange={(e) => setData('plan', e.target.value)}
                        className="rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:border-emerald-500 focus:outline-none"
                    >
                        <option value="">Tous les forfaits</option>
                        <option value="starter">Starter</option>
                        <option value="business">Business</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                    <button
                        type="submit"
                        className="rounded-lg bg-subtle px-4 py-2 text-sm text-primary transition hover:bg-white/20"
                    >
                        Filtrer
                    </button>
                </form>

                <div className="overflow-hidden rounded-xl border border-theme bg-surface">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-theme">
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Entreprise / Contact
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Offre choisie
                                </th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell">
                                    Email
                                </th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
                                    Téléphone
                                </th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:table-cell">
                                    Message
                                </th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Statut
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {quoteRequests.data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-10 text-center text-sm text-gray-500">
                                        Aucune demande de devis
                                    </td>
                                </tr>
                            )}
                            {quoteRequests.data.map((r) => (
                                <tr key={r.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-primary">{r.company_name}</p>
                                        <p className="text-xs text-gray-500">
                                            {r.first_name} {r.last_name}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        {r.plan ? (
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${planBadge[r.plan] ?? 'bg-gray-500/20 text-muted'}`}
                                                title="Forfait choisi par le client"
                                            >
                                                {planLabel[r.plan] ?? r.plan}
                                            </span>
                                        ) : (
                                            <span className="text-amber-600 dark:text-amber-400 text-xs">Non renseigné</span>
                                        )}
                                    </td>
                                    <td className="hidden px-4 py-3 text-sm text-muted sm:table-cell">{r.email}</td>
                                    <td className="hidden px-4 py-3 text-sm text-muted md:table-cell">
                                        {r.phone ? (
                                            <a href={`tel:${r.phone}`} className="hover:text-emerald-400">{r.phone}</a>
                                        ) : (
                                            <span className="text-gray-500">—</span>
                                        )}
                                    </td>
                                    <td className="hidden px-4 py-3 text-sm text-muted lg:table-cell">
                                        {r.message ? (
                                            <span className="truncate max-w-[120px] inline-block" title={r.message}>
                                                {r.message.length > 40 ? `${r.message.slice(0, 40)}…` : r.message}
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">—</span>
                                        )}
                                    </td>
                                    <td className="hidden px-4 py-3 text-sm text-muted md:table-cell">
                                        {new Date(r.created_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        {r.company_id && r.company ? (
                                            <Link
                                                href={route('admin.companies.show', r.company.id)}
                                                className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400 hover:underline"
                                            >
                                                Convertie
                                            </Link>
                                        ) : (
                                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                                                En attente
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={route('admin.quote-requests.show', r.id)}
                                            className="text-xs text-emerald-400 hover:underline"
                                        >
                                            Voir
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {quoteRequests.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {quoteRequests.links.map((l, i) =>
                            l.url ? (
                                <Link
                                    key={i}
                                    href={l.url}
                                    className={`rounded px-3 py-1 text-sm transition ${l.active ? 'bg-emerald-500 text-primary' : 'bg-subtle text-muted hover:bg-subtle'}`}
                                    dangerouslySetInnerHTML={{ __html: l.label }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    className="rounded px-3 py-1 text-sm text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: l.label }}
                                />
                            )
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
