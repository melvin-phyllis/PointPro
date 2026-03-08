import AttendanceMap from '@/Components/AttendanceMap';
import Badge from '@/Components/ui/Badge';
import DeptProgressBars from '@/Components/DeptProgressBars';
import StatsCard from '@/Components/StatsCard';
import WeeklyChart from '@/Components/WeeklyChart';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AttendanceStatus, DashboardStats, DeptStat, PageProps, WeeklyStat } from '@/types';
import { Head, Link } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Users2, XCircle } from 'lucide-react';

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

interface TodayAttendance {
    status: AttendanceStatus;
    check_in?: string;
    check_out?: string;
    late_minutes: number;
    worked_hours?: string;
    location_name?: string;
}

interface MonthSummary {
    present: number; late: number; absent: number;
    total_worked_h: number; month_label: string;
}

interface WeekDay {
    date: string; day: string; is_weekend: boolean; status?: AttendanceStatus;
}

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

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    present:  { label: 'Present',      bg: 'bg-emerald-50 dark:bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
    late:     { label: 'En retard',    bg: 'bg-amber-50 dark:bg-amber-500/15',     text: 'text-amber-700 dark:text-amber-400',     dot: 'bg-amber-500'   },
    absent:   { label: 'Absent',       bg: 'bg-red-50 dark:bg-red-500/15',         text: 'text-red-700 dark:text-red-400',         dot: 'bg-red-500'     },
    excused:  { label: 'Excuse',       bg: 'bg-blue-50 dark:bg-blue-500/15',       text: 'text-blue-700 dark:text-blue-400',       dot: 'bg-blue-500'    },
    half_day: { label: 'Demi-journee', bg: 'bg-purple-50 dark:bg-purple-500/15',   text: 'text-purple-700 dark:text-purple-400',   dot: 'bg-purple-500'  },
};

function EmployeeDashboard({ todayAttendance, monthSummary, weekDays }: {
    todayAttendance: TodayAttendance | null;
    monthSummary: MonthSummary;
    weekDays: WeekDay[];
}) {
    const sc = todayAttendance ? (statusConfig[todayAttendance.status] ?? statusConfig.absent) : null;

    return (
        <div className="space-y-6 animate-fade-up">
            <div>
                <h1 className="text-2xl font-bold text-primary">Mon tableau de bord</h1>
                <p className="mt-1 text-sm text-secondary">{monthSummary.month_label}</p>
            </div>

            {/* Carte aujourd'hui */}
            <div className="rounded-xl border border-theme bg-surface p-6 shadow-sm">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-secondary">Aujourd'hui</p>

                {todayAttendance ? (
                    <div className="flex flex-wrap items-center gap-5">
                        <div className={`flex items-center gap-2 rounded-xl px-5 py-3 ${sc!.bg}`}>
                            <span className={`h-2.5 w-2.5 rounded-full ${sc!.dot}`} />
                            <span className={`text-lg font-bold ${sc!.text}`}>{sc!.label}</span>
                        </div>
                        {[
                            { label: 'Arrivee',  value: todayAttendance.check_in ?? '—' },
                            { label: 'Depart',   value: todayAttendance.check_out ?? '—' },
                            ...(todayAttendance.worked_hours ? [{ label: 'Duree', value: todayAttendance.worked_hours }] : []),
                            ...(todayAttendance.late_minutes > 0 ? [{ label: 'Retard', value: `${todayAttendance.late_minutes} min` }] : []),
                        ].map(item => (
                            <div key={item.label} className="text-center">
                                <p className="text-xs text-secondary">{item.label}</p>
                                <p className="font-display font-bold text-2xl text-primary tabular-nums">{item.value}</p>
                            </div>
                        ))}
                        {todayAttendance.location_name && (
                            <div className="text-center">
                                <p className="text-xs text-secondary">Zone</p>
                                <p className="text-sm font-medium text-primary">{todayAttendance.location_name}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-500/10 px-5 py-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                            <span className="text-lg font-bold text-secondary">Pas encore pointe</span>
                        </div>
                        <Link
                            href={route('attendance.index')}
                            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-primary hover:bg-brand-600 transition"
                        >
                            Pointer maintenant <ArrowRight size={14} />
                        </Link>
                    </div>
                )}
            </div>

            {/* Stats du mois */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatsCard title="Jours presents"    value={monthSummary.present}         icon={<CheckCircle2 />}  color="green"  />
                <StatsCard title="Retards"            value={monthSummary.late}            icon={<Clock />}         color="yellow" />
                <StatsCard title="Absences"           value={monthSummary.absent}          icon={<XCircle />}       color="red"    />
                <StatsCard title="Heures travaillees" value={monthSummary.total_worked_h}  icon={<AlertCircle />}   color="blue"   />
            </div>

            {/* 7 derniers jours */}
            <div className="rounded-xl border border-theme bg-surface p-6 shadow-sm">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-secondary">7 derniers jours</p>
                <div className="flex flex-wrap gap-2">
                    {weekDays.map(day => {
                        const cfg = day.status ? statusConfig[day.status] : null;
                        return (
                            <div
                                key={day.date}
                                className={`flex flex-col items-center gap-1.5 rounded-xl px-3 py-2.5 ${
                                    day.is_weekend ? 'bg-gray-50 dark:bg-white/[0.03] opacity-50'
                                    : cfg ? cfg.bg : 'bg-gray-50 dark:bg-white/[0.03]'
                                }`}
                            >
                                <span className="text-xs text-secondary capitalize">{day.day}</span>
                                {day.is_weekend ? (
                                    <span className="text-xs text-muted">—</span>
                                ) : cfg ? (
                                    <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                                ) : (
                                    <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                                )}
                                {!day.is_weekend && cfg && (
                                    <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Raccourcis */}
            <div className="flex flex-wrap gap-3">
                <Link href={route('attendance.index')} className="rounded-xl bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition">
                    Mon pointage
                </Link>
                <Link href={route('attendance.history')} className="rounded-xl border border-theme px-4 py-2 text-sm font-medium text-secondary hover:bg-gray-50 dark:hover:bg-subtle transition">
                    Mon historique
                </Link>
            </div>
        </div>
    );
}

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
        <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Tableau de bord</h1>
                    <p className="mt-1 text-sm text-secondary">Vue globale de la presence du personnel</p>
                </div>
                <Link href={route('team.today')} className="flex items-center gap-1.5 rounded-xl bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition">
                    Voir le detail <ArrowRight size={14} />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatsCard title="Total employes" value={stats.total_employees}                                      icon={<Users2 />}       color="blue"   />
                <StatsCard title="Presents"        value={stats.present}        subtitle={`${stats.attendance_rate}% de taux`} icon={<CheckCircle2 />} color="green"  />
                <StatsCard title="En retard"       value={stats.late}                                               icon={<Clock />}        color="yellow" />
                <StatsCard title="Absents"         value={stats.absent}                                             icon={<XCircle />}      color="red"    />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <WeeklyChart data={weeklyStats} />
                <DeptProgressBars departments={deptStats} />
            </div>

            <AttendanceMap gpsPoints={gpsPoints} zones={zones} />

            {/* Derniers pointages */}
            <div className="rounded-xl border border-theme bg-surface overflow-hidden shadow-sm">
                <div className="flex items-center justify-between border-b border-theme px-6 py-4">
                    <h3 className="text-base font-semibold text-primary">Derniers pointages</h3>
                    <Link href={route('team.index')} className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">
                        Voir tout <ArrowRight size={14} />
                    </Link>
                </div>

                {recentAttendances.length === 0 ? (
                    <div className="p-12 text-center">
                        <Clock size={40} className="mx-auto mb-3 text-secondary dark:text-gray-600" />
                        <p className="text-sm text-secondary">Aucun pointage pour aujourd'hui</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {recentAttendances.map(a => (
                            <div key={a.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/10 text-sm font-bold text-brand-600 dark:text-brand-400">
                                        {a.user.first_name[0]}{a.user.last_name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-primary">{a.user.first_name} {a.user.last_name}</p>
                                        {a.location_name && <p className="text-xs text-secondary">{a.location_name}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-mono text-sm font-semibold text-primary">{a.check_in}</p>
                                        {a.check_out && <p className="text-xs text-secondary">&rarr; {a.check_out}</p>}
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
