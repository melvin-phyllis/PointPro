import Badge from '@/Components/ui/Badge';
import { useClock } from '@/hooks/useClock';
import { useGeolocation } from '@/hooks/useGeolocation';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AttendanceStatus, PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, LogIn, LogOut, MapPin } from 'lucide-react';
import { useState } from 'react';

interface TodayAttendance {
    id: number;
    check_in?: string;
    check_out?: string;
    status: AttendanceStatus;
    late_minutes: number;
    worked_hours?: string;
    is_geo_verified: boolean;
    location_name?: string;
}

interface HistoryItem {
    id: number;
    date: string;
    day_name: string;
    check_in?: string;
    check_out?: string;
    status: AttendanceStatus;
    worked_hours?: string;
    late_minutes: number;
    location_name?: string;
}

type Props = PageProps<{
    todayAttendance: TodayAttendance | null;
    history: HistoryItem[];
}>;

export default function PointageIndex({ todayAttendance, history }: Props) {
    const { time, date } = useClock();
    const { loading: geoLoading, error: geoError, getPosition } = useGeolocation();
    const [processing, setProcessing] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const hasCheckedIn  = !!todayAttendance?.check_in;
    const hasCheckedOut = !!todayAttendance?.check_out;

    async function handleCheckIn() {
        setActionError(null);
        setProcessing(true);
        try {
            const coords = await getPosition();
            router.post(route('attendance.check-in'), { latitude: coords.latitude, longitude: coords.longitude }, {
                onError: (errors) => setActionError(Object.values(errors).join(' ')),
                onFinish: () => setProcessing(false),
            });
        } catch (err: any) {
            setActionError(err.message);
            setProcessing(false);
        }
    }

    async function handleCheckOut() {
        setActionError(null);
        setProcessing(true);
        try {
            const coords = await getPosition();
            router.post(route('attendance.check-out'), { latitude: coords.latitude, longitude: coords.longitude }, {
                onError: (errors) => setActionError(Object.values(errors).join(' ')),
                onFinish: () => setProcessing(false),
            });
        } catch (err: any) {
            setActionError(err.message);
            setProcessing(false);
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title="Mon Pointage" />
            <div className="mx-auto max-w-2xl space-y-6 animate-fade-up">

                {/* Horloge */}
                <div className="rounded-2xl border border-theme bg-surface p-8 text-center shadow-sm">
                    <p className="text-sm font-medium capitalize text-secondary">{date}</p>
                    <p className="mt-2 font-display font-bold text-6xl tracking-widest text-primary tabular-nums">{time}</p>
                    {todayAttendance && (
                        <div className="mt-4 flex justify-center">
                            <Badge status={todayAttendance.status} className="text-sm px-4 py-1" />
                        </div>
                    )}
                </div>

                {/* Infos du jour */}
                {todayAttendance && (
                    <div className="rounded-xl border border-theme bg-surface p-6 shadow-sm">
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-secondary">
                            Pointage d'aujourd'hui
                        </h3>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {[
                                { label: 'Arrivee',  value: todayAttendance.check_in ?? '—',  color: 'text-brand-600 dark:text-brand-400' },
                                { label: 'Depart',   value: todayAttendance.check_out ?? '—', color: 'text-primary' },
                                { label: 'Duree',    value: todayAttendance.worked_hours ?? '—', color: 'text-primary' },
                                { label: 'Retard',   value: todayAttendance.late_minutes > 0 ? `${todayAttendance.late_minutes} min` : '—', color: 'text-amber-600 dark:text-amber-400' },
                            ].map(item => (
                                <div key={item.label} className="text-center">
                                    <p className="text-xs text-secondary">{item.label}</p>
                                    <p className={`mt-1 font-display font-bold text-xl tabular-nums ${item.color}`}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                        {todayAttendance.location_name && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-secondary">
                                <MapPin size={14} className="text-brand-500" />
                                <span>{todayAttendance.location_name}</span>
                                {todayAttendance.is_geo_verified && (
                                    <span className="text-brand-600 dark:text-brand-400 font-medium">verif. GPS</span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Erreur */}
                {(actionError || geoError) && (
                    <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
                        {actionError ?? geoError}
                    </div>
                )}

                {/* Bouton principal */}
                <div className="flex flex-col items-center gap-4">
                    {!hasCheckedIn && (
                        <button
                            onClick={handleCheckIn}
                            disabled={processing || geoLoading}
                            className="group relative flex h-40 w-40 items-center justify-center rounded-full bg-brand-500 shadow-xl shadow-brand-500/30 transition-all duration-300 hover:scale-105 hover:shadow-brand-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(processing || geoLoading) ? (
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                            ) : (
                                <div className="text-center">
                                    <LogIn size={40} className="mx-auto text-primary" />
                                    <p className="mt-1 text-sm font-bold text-primary">Arrivee</p>
                                </div>
                            )}
                            <span className="absolute inset-0 rounded-full bg-brand-500 opacity-25 animate-ping" style={{ animationDuration: '2s' }} />
                        </button>
                    )}

                    {hasCheckedIn && !hasCheckedOut && (
                        <button
                            onClick={handleCheckOut}
                            disabled={processing || geoLoading}
                            className="group relative flex h-40 w-40 items-center justify-center rounded-full bg-red-500 shadow-xl shadow-red-500/30 transition-all duration-300 hover:scale-105 hover:shadow-red-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(processing || geoLoading) ? (
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                            ) : (
                                <div className="text-center">
                                    <LogOut size={40} className="mx-auto text-primary" />
                                    <p className="mt-1 text-sm font-bold text-primary">Depart</p>
                                </div>
                            )}
                        </button>
                    )}

                    {hasCheckedIn && hasCheckedOut && (
                        <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/10">
                            <div className="text-center">
                                <CheckCircle size={40} className="mx-auto text-brand-500" />
                                <p className="mt-1 text-sm font-semibold text-brand-600 dark:text-brand-400">Journee<br/>terminee</p>
                            </div>
                        </div>
                    )}

                    {(processing || geoLoading) && (
                        <p className="text-sm text-secondary animate-pulse">
                            {geoLoading ? 'Recuperation de votre position GPS...' : 'Enregistrement en cours...'}
                        </p>
                    )}
                </div>

                {/* Historique */}
                <div className="rounded-xl border border-theme bg-surface overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between border-b border-theme px-5 py-3.5">
                        <h3 className="text-sm font-semibold text-primary">7 derniers jours</h3>
                        <a href={route('attendance.history')} className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">
                            Voir tout
                        </a>
                    </div>

                    {history.length === 0 ? (
                        <p className="p-6 text-center text-sm text-secondary">Aucun historique disponible.</p>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {history.map(item => (
                                <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 text-center">
                                            <p className="text-xs font-semibold text-primary capitalize">{item.day_name}</p>
                                            <p className="text-xs text-secondary">{item.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-mono text-primary">
                                                {item.check_in ?? '—'} &rarr; {item.check_out ?? '—'}
                                            </p>
                                            <p className="text-xs text-secondary">{item.worked_hours ?? '—'}</p>
                                        </div>
                                    </div>
                                    <Badge status={item.status} showDot={false} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
