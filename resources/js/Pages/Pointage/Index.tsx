import Badge from '@/Components/ui/Badge';
import { useClock } from '@/hooks/useClock';
import { useGeolocation } from '@/hooks/useGeolocation';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AttendanceStatus, PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
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
            router.post(route('attendance.check-in'), {
                latitude:  coords.latitude,
                longitude: coords.longitude,
            }, {
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
            router.post(route('attendance.check-out'), {
                latitude:  coords.latitude,
                longitude: coords.longitude,
            }, {
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

            <div className="mx-auto max-w-2xl space-y-6">
                {/* ─── Horloge ─── */}
                <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 text-center">
                    <p className="text-sm font-medium capitalize text-gray-500">{date}</p>
                    <p className="mt-2 font-mono text-6xl font-bold tracking-widest text-white">
                        {time}
                    </p>

                    {/* Statut du jour */}
                    {todayAttendance && (
                        <div className="mt-4 flex justify-center">
                            <Badge status={todayAttendance.status} className="text-sm px-4 py-1" />
                        </div>
                    )}
                </div>

                {/* ─── Info pointage du jour ─── */}
                {todayAttendance && (
                    <div className="rounded-xl border border-white/10 bg-[#111827] p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Pointage d'aujourd'hui
                        </h3>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Arrivée</p>
                                <p className="mt-1 font-mono text-xl font-bold text-emerald-400">
                                    {todayAttendance.check_in ?? '—'}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Départ</p>
                                <p className="mt-1 font-mono text-xl font-bold text-gray-300">
                                    {todayAttendance.check_out ?? '—'}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Durée</p>
                                <p className="mt-1 font-mono text-xl font-bold text-gray-300">
                                    {todayAttendance.worked_hours ?? '—'}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Retard</p>
                                <p className="mt-1 font-mono text-xl font-bold text-amber-400">
                                    {todayAttendance.late_minutes > 0 ? `${todayAttendance.late_minutes} min` : '—'}
                                </p>
                            </div>
                        </div>

                        {todayAttendance.location_name && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {todayAttendance.location_name}
                                {todayAttendance.is_geo_verified && (
                                    <span className="text-emerald-500">✓ Vérifié GPS</span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Erreur ─── */}
                {(actionError || geoError) && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                        {actionError ?? geoError}
                    </div>
                )}

                {/* ─── Bouton de pointage ─── */}
                <div className="flex flex-col items-center gap-4">
                    {!hasCheckedIn && (
                        <button
                            onClick={handleCheckIn}
                            disabled={processing || geoLoading}
                            className="group relative flex h-40 w-40 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {(processing || geoLoading) ? (
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                            ) : (
                                <div className="text-center">
                                    <svg className="mx-auto h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="mt-1 text-sm font-bold text-white">Arrivée</p>
                                </div>
                            )}
                            {/* Halo animé */}
                            <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-30 animate-ping" style={{ animationDuration: '2s' }} />
                        </button>
                    )}

                    {hasCheckedIn && !hasCheckedOut && (
                        <button
                            onClick={handleCheckOut}
                            disabled={processing || geoLoading}
                            className="group relative flex h-40 w-40 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-105 hover:shadow-red-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {(processing || geoLoading) ? (
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                            ) : (
                                <div className="text-center">
                                    <svg className="mx-auto h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <p className="mt-1 text-sm font-bold text-white">Départ</p>
                                </div>
                            )}
                        </button>
                    )}

                    {hasCheckedIn && hasCheckedOut && (
                        <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-emerald-500/30 bg-emerald-500/10">
                            <div className="text-center">
                                <svg className="mx-auto h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="mt-1 text-sm font-medium text-emerald-400">Journée<br/>terminée</p>
                            </div>
                        </div>
                    )}

                    {(processing || geoLoading) && (
                        <p className="text-sm text-gray-500 animate-pulse">
                            {geoLoading ? 'Récupération de votre position GPS...' : 'Enregistrement en cours...'}
                        </p>
                    )}
                </div>

                {/* ─── Historique des 7 derniers jours ─── */}
                <div className="rounded-xl border border-white/10 bg-[#111827]">
                    <div className="flex items-center justify-between border-b border-white/10 p-4">
                        <h3 className="text-sm font-semibold text-gray-300">7 derniers jours</h3>
                        <a href={route('attendance.history')} className="text-xs text-emerald-400 hover:text-emerald-300">
                            Voir tout →
                        </a>
                    </div>

                    {history.length === 0 ? (
                        <p className="p-6 text-center text-sm text-gray-500">Aucun historique disponible.</p>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {history.map((item) => (
                                <div key={item.id} className="flex items-center justify-between px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="text-center w-12">
                                            <p className="text-xs font-medium text-gray-400 capitalize">{item.day_name}</p>
                                            <p className="text-xs text-gray-600">{item.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-mono text-gray-300">
                                                {item.check_in ?? '—'} → {item.check_out ?? '—'}
                                            </p>
                                            <p className="text-xs text-gray-500">{item.worked_hours ?? '—'}</p>
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
