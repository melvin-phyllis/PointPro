import Badge from '@/Components/ui/Badge';
import StatsCard from '@/Components/StatsCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AttendanceStatus, DashboardStats, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface EmployeeStatus {
    id: number;
    full_name: string;
    department?: string;
    role: string;
    avatar?: string;
    attendance?: {
        check_in?: string;
        check_out?: string;
        status: AttendanceStatus;
        late_minutes: number;
        location_name?: string;
    } | null;
}

type Props = PageProps<{
    employees: EmployeeStatus[];
    stats: DashboardStats;
}>;

export default function AujourdhUI({ employees, stats }: Props) {
    const [filter, setFilter] = useState<string>('all');

    // Auto-refresh toutes les 15s
    useEffect(() => {
        const id = setInterval(() => router.reload({ only: ['employees', 'stats'] }), 5000);
        return () => clearInterval(id);
    }, []);

    const filtered = employees.filter(e => {
        if (filter === 'all') return true;
        if (filter === 'present') return e.attendance?.status === 'present' || e.attendance?.status === 'late';
        if (filter === 'absent') return !e.attendance || e.attendance.status === 'absent';
        if (filter === 'late') return e.attendance?.status === 'late';
        return true;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Aujourd'hui — Vue temps réel" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-white">Vue temps réel</h1>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm text-gray-500">Mise à jour en direct</span>
                        </div>
                        <Link href={route('team.index')} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/5">
                            Historique →
                        </Link>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatsCard title="Total" value={stats.total_employees} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} color="blue" />
                    <StatsCard title="Présents" value={stats.present} subtitle={`${stats.attendance_rate}%`} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="green" />
                    <StatsCard title="En retard" value={stats.late} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="yellow" />
                    <StatsCard title="Absents" value={stats.absent} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} color="red" />
                </div>

                {/* Filtres rapides */}
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: 'Tous' },
                        { key: 'present', label: 'Présents' },
                        { key: 'late', label: 'En retard' },
                        { key: 'absent', label: 'Absents' },
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${filter === f.key
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Grille employés */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((emp) => (
                        <div key={emp.id} className="rounded-xl border border-white/10 bg-[#111827] p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-400">
                                        {emp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">{emp.full_name}</p>
                                        <p className="text-xs text-gray-500">{emp.department ?? 'Sans département'}</p>
                                    </div>
                                </div>
                                {emp.attendance ? (
                                    <Badge status={emp.attendance.status} showDot={false} />
                                ) : (
                                    <Badge status="absent" showDot={false} />
                                )}
                            </div>

                            {emp.attendance && (
                                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                                    <div className="rounded-lg bg-white/5 py-2">
                                        <p className="text-xs text-gray-500">Arrivée</p>
                                        <p className="font-mono text-sm font-bold text-emerald-400">
                                            {emp.attendance.check_in ?? '—'}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-white/5 py-2">
                                        <p className="text-xs text-gray-500">Départ</p>
                                        <p className="font-mono text-sm font-bold text-gray-300">
                                            {emp.attendance.check_out ?? '—'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!emp.attendance && (
                                <div className="mt-4 rounded-lg bg-red-500/5 py-3 text-center">
                                    <p className="text-xs text-red-400">Non pointé</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p className="py-12 text-center text-sm text-gray-500">
                        Aucun employé dans cette catégorie.
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
