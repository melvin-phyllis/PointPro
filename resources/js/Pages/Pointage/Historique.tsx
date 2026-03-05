import Badge from '@/Components/ui/Badge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AttendanceStatus, PageProps, PaginatedData } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface HistoryItem {
    id: number;
    date: string;
    day_name: string;
    check_in?: string;
    check_out?: string;
    status: AttendanceStatus;
    worked_hours?: string;
    late_minutes: number;
    overtime_hours: number;
    is_geo_verified: boolean;
    location_name?: string;
}

type Props = PageProps<{
    attendances: PaginatedData<HistoryItem>;
}>;

export default function Historique({ attendances }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Mon historique de pointage" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('attendance.index')} className="text-gray-500 hover:text-gray-300">
                        ← Retour
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Mon historique</h1>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-left">
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Arrivée</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Départ</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Durée</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Retard</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">GPS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {attendances.data.map((a) => (
                                    <tr key={a.id} className="hover:bg-white/[0.02]">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-200">{a.date}</p>
                                            <p className="text-xs capitalize text-gray-500">{a.day_name}</p>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-300">
                                            {a.check_in ?? <span className="text-gray-600">—</span>}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-300">
                                            {a.check_out ?? <span className="text-gray-600">—</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {a.worked_hours ?? '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {a.late_minutes > 0 ? (
                                                <span className="text-amber-400">{a.late_minutes} min</span>
                                            ) : (
                                                <span className="text-gray-600">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge status={a.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            {a.is_geo_verified ? (
                                                <span className="text-xs text-emerald-400">✓</span>
                                            ) : (
                                                <span className="text-xs text-gray-600">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {attendances.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
                            <p className="text-sm text-gray-500">
                                {attendances.from}–{attendances.to} sur {attendances.total}
                            </p>
                            <div className="flex gap-2">
                                {attendances.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`rounded px-3 py-1 text-sm transition ${
                                            link.active
                                                ? 'bg-emerald-500 text-white'
                                                : 'text-gray-400 hover:bg-white/10'
                                        } ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
