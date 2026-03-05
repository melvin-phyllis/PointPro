import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Company, PageProps, PaginatedData } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Props = PageProps<{
    companies: PaginatedData<Company & { users_count: number }>;
    filters: { search?: string };
}>;

export default function AdminCompaniesIndex({ companies, filters }: Props) {
    const planColors: Record<string, string> = {
        starter:    'bg-gray-500/20 text-gray-400',
        business:   'bg-blue-500/20 text-blue-400',
        enterprise: 'bg-purple-500/20 text-purple-400',
        custom:     'bg-amber-500/20 text-amber-400',
    };

    return (
        <AuthenticatedLayout>
            <Head title="Super Admin — Entreprises" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Gestion des entreprises</h1>
                <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-left">
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Entreprise</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Plan</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Utilisateurs</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {companies.data.map((c) => (
                                    <tr key={c.id} className="hover:bg-white/[0.02]">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-200">{c.name}</p>
                                            <p className="text-xs text-gray-500">{c.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${planColors[c.plan]}`}>
                                                {c.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{(c as any).users_count}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {c.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={route('admin.companies.show', c.id)} className="text-xs text-gray-400 hover:text-gray-200">
                                                Détails →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
