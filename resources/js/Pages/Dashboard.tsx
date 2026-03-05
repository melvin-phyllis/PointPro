import AttendanceMap from '@/Components/AttendanceMap';
import Badge from '@/Components/ui/Badge';
import DeptProgressBars from '@/Components/DeptProgressBars';
import StatsCard from '@/Components/StatsCard';
import WeeklyChart from '@/Components/WeeklyChart';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AttendanceStatus, DashboardStats, DeptStat, PageProps, WeeklyStat } from '@/types';
import { Head, Link } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';

// ─── Types admin ──────────────────────────────────────────────
interface RecentAttendance {
    id: number;
    user: { id: number; first_name: string; last_name: string };
    check_in: string;
    check_out?: string;
    status: AttendanceStatus;
    late_minutes: number;
    location_name?: string;
}

interface GpsPoint {
    id: number; name: string; lat: number; lng: number;
    status: AttendanceStatus; check_in: string; geo_ok: boolean;
}

interface Zone { id: number; name: string; lat: number; lng: number; radius: number; }

// ─── Types employé ────────────────────────────────────────────
interface TodayAttendance {
    status: AttendanceStatus;
    check_in?: string;
    check_out?: string;
    late_minutes: number;
    worked_hours?: string;
    location_name?: string;
}

interface MonthSummary {
    present: number;
    late: number;
    absent: number;
    total_worked_h: number;
    month_label: string;
}

interface WeekDay {
    date: string;
    day: string;
    is_weekend: boolean;
    status?: AttendanceStatus;
}

// ─── Props union ──────────────────────────────────────────────
type AdminProps = PageProps<{
    role: 'admin';
    stats: DashboardStats;
    weeklyStats: WeeklyStat[];
    deptStats: DeptStat[];
    recentAttendances: RecentAttendance[];
    gpsPoints: GpsPoint[];
    zones: Zone[];
}>;

type EmployeeProps = PageProps<{
    role: 'employee';
    todayAttendance: TodayAttendance | null;
    monthSummary: MonthSummary;
    weekDays: WeekDay[];
}>;

type Props = AdminProps | EmployeeProps;

// ─── Statut couleurs ──────────────────────────────────────────
const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    present: { label: 'Présent',     bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    late:    { label: 'En retard',   bg: 'bg-amber-500/15',   text: 'text-amber-400',   dot: 'bg-amber-400'   },
    absent:  { label: 'Absent',      bg: 'bg-red-500/15',     text: 'text-red-400',     dot: 'bg-red-400'     },
    excused: { label: 'Excusé',      bg: 'bg-blue-500/15',    text: 'text-blue-400',    dot: 'bg-blue-400'    },
    half_day:{ label: 'Demi-journée',bg: 'bg-purple-500/15',  text: 'text-purple-400',  dot: 'bg-purple-400'  },
};

// ─── Vue personnelle (employé) ────────────────────────────────
function EmployeeDashboard({ todayAttendance, monthSummary, weekDays }: {
    todayAttendance: TodayAttendance | null;
    monthSummary: MonthSummary;
    weekDays: WeekDay[];
}) {
    const sc = todayAttendance ? (statusConfig[todayAttendance.status] ?? statusConfig.absent) : null;

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div>
                <h1 className="text-2xl font-bold text-white">Mon tableau de bord</h1>
                <p className="mt-1 text-sm text-gray-500">{monthSummary.month_label}</p>
            </div>

            {/* ── Carte "aujourd'hui" ── */}
            <div className="rounded-xl border border-white/10 bg-[#111827] p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Aujourd'hui</p>

                {todayAttendance ? (
                    <div className="flex flex-wrap items-center gap-6">
                        {/* Statut */}
                        <div className={`flex items-center gap-2 rounded-xl px-5 py-3 ${sc!.bg}`}>
                            <span className={`h-2.5 w-2.5 rounded-full ${sc!.dot}`} />
                            <span className={`text-lg font-bold ${sc!.text}`}>{sc!.label}</span>
                        </div>

                        {/* Arrivée */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500">Arrivée</p>
                            <p className="font-mono text-2xl font-bold text-white">
                                {todayAttendance.check_in ?? '—'}
                            </p>
                        </div>

                        {/* Départ */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500">Départ</p>
                            <p className="font-mono text-2xl font-bold text-gray-300">
                                {todayAttendance.check_out ?? '—'}
                            </p>
                        </div>

                        {/* Durée */}
                        {todayAttendance.worked_hours && (
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Durée</p>
                                <p className="font-mono text-2xl font-bold text-gray-300">
                                    {todayAttendance.worked_hours}
                                </p>
                            </div>
                        )}

                        {/* Zone */}
                        {todayAttendance.location_name && (
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Zone</p>
                                <p className="text-sm font-medium text-gray-300">{todayAttendance.location_name}</p>
                            </div>
                        )}

                        {/* Retard */}
                        {todayAttendance.late_minutes > 0 && (
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Retard</p>
                                <p className="text-sm font-semibold text-amber-400">{todayAttendance.late_minutes} min</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-xl bg-gray-500/10 px-5 py-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-gray-500" />
                            <span className="text-lg font-bold text-gray-400">Pas encore pointé</span>
                        </div>
                        <Link
                            href={route('attendance.index')}
                            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition"
                        >
                            Pointer maintenant →
                        </Link>
                    </div>
                )}
            </div>

            {/* ── Stats du mois ── */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatsCard
                    title="Jours présents"
                    value={monthSummary.present}
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    color="green"
                />
                <StatsCard
                    title="Retards"
                    value={monthSummary.late}
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    color="yellow"
                />
                <StatsCard
                    title="Absences"
                    value={monthSummary.absent}
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
                    color="red"
                />
                <StatsCard
                    title="Heures travaillées"
                    value={monthSummary.total_worked_h}
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    color="blue"
                />
            </div>

            {/* ── 7 derniers jours ── */}
            <div className="rounded-xl border border-white/10 bg-[#111827] p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    7 derniers jours
                </p>
                <div className="flex flex-wrap gap-2">
                    {weekDays.map(day => {
                        const cfg = day.status ? statusConfig[day.status] : null;
                        return (
                            <div
                                key={day.date}
                                className={`flex flex-col items-center gap-1.5 rounded-lg px-3 py-2.5 ${
                                    day.is_weekend
                                        ? 'bg-white/[0.03] opacity-50'
                                        : cfg ? cfg.bg : 'bg-white/[0.03]'
                                }`}
                            >
                                <span className="text-xs text-gray-500 capitalize">{day.day}</span>
                                {day.is_weekend ? (
                                    <span className="text-xs text-gray-600">—</span>
                                ) : cfg ? (
                                    <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                                ) : (
                                    <span className="h-2 w-2 rounded-full bg-gray-600" />
                                )}
                                {!day.is_weekend && cfg && (
                                    <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Raccourcis ── */}
            <div className="flex flex-wrap gap-3">
                <Link
                    href={route('attendance.index')}
                    className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition"
                >
                    Mon pointage →
                </Link>
                <Link
                    href={route('attendance.history')}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 transition"
                >
                    Mon historique →
                </Link>
            </div>
        </div>
    );
}

// ─── Page principale ──────────────────────────────────────────
export default function Dashboard(props: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Tableau de bord" />

            {props.role === 'employee' ? (
                <EmployeeDashboard
                    todayAttendance={(props as EmployeeProps).todayAttendance}
                    monthSummary={(props as EmployeeProps).monthSummary}
                    weekDays={(props as EmployeeProps).weekDays}
                />
            ) : (
                <AdminDashboardView
                    stats={(props as AdminProps).stats}
                    weeklyStats={(props as AdminProps).weeklyStats}
                    deptStats={(props as AdminProps).deptStats}
                    recentAttendances={(props as AdminProps).recentAttendances}
                    gpsPoints={(props as AdminProps).gpsPoints}
                    zones={(props as AdminProps).zones}
                />
            )}
        </AuthenticatedLayout>
    );
}

// ─── Vue admin/manager ────────────────────────────────────────
interface AdminViewProps {
    stats: DashboardStats;
    weeklyStats: WeeklyStat[];
    deptStats: DeptStat[];
    recentAttendances: RecentAttendance[];
    gpsPoints: GpsPoint[];
    zones: Zone[];
}
function AdminDashboardView({ stats, weeklyStats, deptStats, recentAttendances, gpsPoints, zones }: AdminViewProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
                    <p className="mt-1 text-sm text-gray-500">Vue globale de la présence du personnel</p>
                </div>
                <Link
                    href={route('team.today')}
                    className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                >
                    Voir le détail →
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total employés" value={stats.total_employees} color="blue"
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
                <StatsCard title="Présents" value={stats.present} subtitle={`${stats.attendance_rate}% de taux`} color="green"
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatsCard title="En retard" value={stats.late} color="yellow"
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatsCard title="Absents" value={stats.absent} color="red"
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <WeeklyChart data={weeklyStats} />
                <DeptProgressBars departments={deptStats} />
            </div>

            <AttendanceMap gpsPoints={gpsPoints} zones={zones} />

            <div className="rounded-xl border border-white/10 bg-[#111827]">
                <div className="flex items-center justify-between border-b border-white/10 p-6">
                    <h3 className="text-lg font-semibold text-white">Derniers pointages</h3>
                    <Link href={route('team.index')} className="text-sm text-emerald-400 hover:text-emerald-300">
                        Voir tout →
                    </Link>
                </div>

                {recentAttendances.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <svg className="mx-auto mb-4 h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>Aucun pointage pour aujourd'hui</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {recentAttendances.map((a: RecentAttendance) => (
                            <div key={a.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-400">
                                        {a.user.first_name[0]}{a.user.last_name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">
                                            {a.user.first_name} {a.user.last_name}
                                        </p>
                                        {a.location_name && (
                                            <p className="text-xs text-gray-500">{a.location_name}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-mono text-sm font-medium text-gray-300">{a.check_in}</p>
                                        {a.check_out && (
                                            <p className="text-xs text-gray-500">→ {a.check_out}</p>
                                        )}
                                    </div>
                                    <Badge status={a.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
