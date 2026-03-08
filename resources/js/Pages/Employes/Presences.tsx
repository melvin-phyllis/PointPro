import Badge from '@/Components/ui/Badge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AttendanceStatus, PageProps, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface DayRow {
    date: string;
    day_label: string;
    is_weekend: boolean;
    check_in?: string;
    check_out?: string;
    status?: AttendanceStatus;
    late_minutes: number;
    worked_hours?: string;
    location_name?: string;
    is_geo_verified: boolean;
}

interface Summary {
    present: number;
    late: number;
    absent: number;
    excused: number;
    total_worked_h: number;
    total_overtime_h: number;
    total_late_min: number;
}

type Props = PageProps<{
    employe: User & { department?: { id: number; name: string } };
    days: DayRow[];
    summary: Summary;
    year: number;
    month: number;
    monthName: string;
}>;

export default function EmployePresences({ employe, days, summary, year, month, monthName }: Props) {

    function navigate(y: number, m: number) {
        router.get(route('employes.presences', employe.id), { year: y, month: m });
    }

    function prevMonth() {
        if (month === 1) navigate(year - 1, 12);
        else navigate(year, month - 1);
    }

    function nextMonth() {
        const now = new Date();
        if (year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)) return;
        if (month === 12) navigate(year + 1, 1);
        else navigate(year, month + 1);
    }

    const isCurrentMonth = year === new Date().getFullYear() && month === new Date().getMonth() + 1;

    const statusColor: Record<string, string> = {
        present: 'text-emerald-400',
        late:    'text-yellow-400',
        absent:  'text-red-400',
        excused: 'text-blue-400',
    };

    function fmtMin(min: number) {
        if (!min) return '—';
        return `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}`;
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Présences — ${employe.full_name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href={route('employes.index')} className="text-gray-500 hover:text-secondary">← Employés</Link>
                        <div>
                            <h1 className="text-2xl font-bold text-primary">{employe.full_name}</h1>
                            <p className="text-sm text-gray-500">
                                {employe.department?.name ?? 'Sans département'} · {employe.employee_id_number ?? '—'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={route('employes.presences.export', employe.id) + '?' + new URLSearchParams({ year: String(year), month: String(month) }).toString()}
                            className="flex items-center gap-2 rounded-lg border border-theme px-4 py-2 text-sm text-muted hover:bg-subtle hover:text-primary"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Exporter CSV
                        </a>
                        <Link
                            href={route('employes.edit', employe.id)}
                            className="rounded-lg border border-theme px-4 py-2 text-sm text-muted hover:bg-subtle"
                        >
                            Modifier le profil
                        </Link>
                    </div>
                </div>

                {/* Résumé du mois */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                    {[
                        { label: 'Présents',    value: summary.present,         color: 'text-emerald-400' },
                        { label: 'En retard',   value: summary.late,            color: 'text-yellow-400' },
                        { label: 'Absents',     value: summary.absent,          color: 'text-red-400' },
                        { label: 'Excusés',     value: summary.excused,         color: 'text-blue-400' },
                        { label: 'Heures trav.',value: `${summary.total_worked_h}h`,  color: 'text-primary' },
                        { label: 'Heures sup.', value: `${summary.total_overtime_h}h`, color: 'text-purple-400' },
                        { label: 'Retard total',value: fmtMin(summary.total_late_min), color: 'text-orange-400' },
                    ].map(s => (
                        <div key={s.label} className="rounded-xl border border-theme bg-surface p-4 text-center">
                            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Navigation mois */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={prevMonth}
                        className="rounded-lg border border-theme px-3 py-2 text-sm text-muted hover:bg-subtle"
                    >
                        ‹ Mois précédent
                    </button>
                    <span className="flex-1 text-center text-base font-semibold capitalize text-primary">{monthName}</span>
                    <button
                        onClick={nextMonth}
                        disabled={isCurrentMonth}
                        className="rounded-lg border border-theme px-3 py-2 text-sm text-muted hover:bg-subtle disabled:opacity-30"
                    >
                        Mois suivant ›
                    </button>
                </div>

                {/* Tableau journalier */}
                <div className="rounded-xl border border-theme bg-surface overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-theme text-left">
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Jour</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Arrivée</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Départ</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Durée</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Retard</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Zone</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {days.map(day => (
                                    <tr
                                        key={day.date}
                                        className={`${day.is_weekend ? 'opacity-40' : 'hover:bg-white/[0.02]'}`}
                                    >
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium capitalize text-secondary">{day.day_label}</p>
                                            {day.is_weekend && <p className="text-xs text-gray-600">Week-end</p>}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-sm text-secondary">{day.check_in ?? '—'}</td>
                                        <td className="px-4 py-3 font-mono text-sm text-secondary">{day.check_out ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-muted">{day.worked_hours ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {day.late_minutes > 0
                                                ? <span className="text-yellow-400">{day.late_minutes} min</span>
                                                : <span className="text-gray-600">—</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted">
                                            {day.location_name
                                                ? <span>{day.location_name}{day.is_geo_verified && <span className="ml-1 text-emerald-500">✓</span>}</span>
                                                : <span className="text-gray-600">—</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3">
                                            {day.status
                                                ? <Badge status={day.status} />
                                                : <span className="text-xs text-gray-600">—</span>
                                            }
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
