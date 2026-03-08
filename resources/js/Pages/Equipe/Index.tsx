import Badge from '@/Components/ui/Badge';
import StatsCard from '@/Components/StatsCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AttendanceStatus, DashboardStats, Department, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface AttendanceRow {
    id: number;
    user: { id: number; full_name: string; department?: string; role: string; avatar?: string };
    check_in?: string;
    check_out?: string;
    status: AttendanceStatus;
    late_minutes: number;
    worked_hours?: string;
    location_name?: string;
}

type Props = PageProps<{
    attendances: AttendanceRow[];
    departments: Department[];
    stats: DashboardStats;
    date: string;
    filters: { date?: string; department_id?: string };
}>;

export default function EquipeIndex({ attendances, departments, stats, date, filters }: Props) {
    const [selectedDept, setSelectedDept] = useState(filters.department_id ?? '');
    const [selectedDate, setSelectedDate] = useState(date);
    const [showExportPanel, setShowExportPanel] = useState(false);
    const today = new Date().toISOString().slice(0, 10);
    const [exportFrom, setExportFrom] = useState(() => {
        const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10);
    });
    const [exportTo, setExportTo] = useState(today);
    const [exportDept, setExportDept] = useState('');
    const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('xlsx');

    function navigate(newDate: string, deptId?: string) {
        setSelectedDate(newDate);
        router.get(route('team.index'), {
            date: newDate,
            department_id: (deptId ?? selectedDept) || undefined,
        }, { preserveState: false });
    }

    function prevDay() {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        navigate(d.toISOString().slice(0, 10));
    }

    function nextDay() {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        navigate(d.toISOString().slice(0, 10));
    }

    const isToday = selectedDate === today;

    function buildExportUrl() {
        const params: Record<string, string> = { date_from: exportFrom, date_to: exportTo, format: exportFormat };
        if (exportDept) params.department_id = exportDept;
        return route('team.export.period') + '?' + new URLSearchParams(params).toString();
    }

    return (
        <AuthenticatedLayout>
            <Head title="Historique des présences" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-primary">Historique des présences</h1>
                    <div className="flex items-center gap-3">
                        {/* Export dropdown */}
                        <div className="relative">
                            <div className="flex items-center gap-1">
                                <div className="flex rounded-lg border border-theme overflow-hidden">
                                    {(['xlsx', 'csv'] as const).map(fmt => (
                                        <button
                                            key={fmt}
                                            onClick={() => setExportFormat(fmt)}
                                            className={`px-3 py-2 text-xs font-medium transition ${exportFormat === fmt ? 'bg-emerald-500 text-primary' : 'bg-surface text-muted hover:bg-subtle'}`}
                                        >
                                            {fmt.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setShowExportPanel(v => !v)}
                                    className="flex items-center gap-1.5 rounded-lg border border-theme px-3 py-2 text-xs text-muted hover:bg-subtle hover:text-primary"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Exporter
                                    <svg className={`h-3 w-3 transition-transform ${showExportPanel ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>

                            {showExportPanel && (
                                <div className="absolute right-0 top-full z-30 mt-2 w-80 rounded-xl border border-theme bg-surface p-4 shadow-xl">
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Période</p>
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="mb-1 block text-xs text-gray-500">Du</label>
                                                <input type="date" value={exportFrom} max={exportTo}
                                                    onChange={e => setExportFrom(e.target.value)}
                                                    className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="mb-1 block text-xs text-gray-500">Au</label>
                                                <input type="date" value={exportTo} min={exportFrom} max={today}
                                                    onChange={e => setExportTo(e.target.value)}
                                                    className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs text-gray-500">Département (optionnel)</label>
                                            <select value={exportDept} onChange={e => setExportDept(e.target.value)}
                                                className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                            >
                                                <option value="">Tous</option>
                                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                            </select>
                                        </div>
                                        <a
                                            href={buildExportUrl()}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Télécharger
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href={route('team.today')} className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20">
                            Vue temps réel →
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatsCard title="Total" value={stats.total_employees} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} color="blue" />
                    <StatsCard title="Présents" value={stats.present} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="green" />
                    <StatsCard title="En retard" value={stats.late} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="yellow" />
                    <StatsCard title="Absents" value={stats.absent} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} color="red" />
                </div>

                {/* Filtres : date + département */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Navigation date */}
                    <div className="flex items-center gap-1 rounded-lg border border-theme bg-surface p-1">
                        <button
                            onClick={prevDay}
                            className="rounded px-2 py-1.5 text-muted hover:bg-subtle hover:text-primary"
                        >
                            ‹
                        </button>
                        <input
                            type="date"
                            value={selectedDate}
                            max={new Date().toISOString().slice(0, 10)}
                            onChange={e => navigate(e.target.value)}
                            className="bg-transparent px-1 text-sm text-primary focus:outline-none"
                        />
                        <button
                            onClick={nextDay}
                            disabled={isToday}
                            className="rounded px-2 py-1.5 text-muted hover:bg-subtle hover:text-primary disabled:opacity-30"
                        >
                            ›
                        </button>
                    </div>

                    {/* Filtre département */}
                    <select
                        value={selectedDept}
                        onChange={e => { setSelectedDept(e.target.value); navigate(selectedDate, e.target.value); }}
                        className="rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                        <option value="">Tous les départements</option>
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>

                    {/* Retour à aujourd'hui */}
                    {!isToday && (
                        <button
                            onClick={() => navigate(new Date().toISOString().slice(0, 10))}
                            className="rounded-lg border border-theme px-3 py-2 text-sm text-muted hover:bg-subtle"
                        >
                            Aujourd'hui
                        </button>
                    )}
                </div>

                {/* Tableau */}
                <div className="rounded-xl border border-theme bg-surface overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-theme text-left">
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Employé</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Arrivée</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Départ</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Durée</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Lieu</th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {attendances.map((a) => (
                                    <tr key={a.id} className="hover:bg-white/[0.02]">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400">
                                                    {a.user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-primary">{a.user.full_name}</p>
                                                    <p className="text-xs text-gray-500">{a.user.department}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-secondary">{a.check_in ?? '—'}</td>
                                        <td className="px-6 py-4 font-mono text-sm text-secondary">{a.check_out ?? '—'}</td>
                                        <td className="px-6 py-4 text-sm text-muted">{a.worked_hours ?? '—'}</td>
                                        <td className="px-6 py-4 text-sm text-muted">{a.location_name ?? '—'}</td>
                                        <td className="px-6 py-4"><Badge status={a.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {attendances.length === 0 && (
                            <p className="p-8 text-center text-sm text-gray-500">Aucun pointage pour cette date.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
