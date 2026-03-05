import DeptProgressBars from '@/Components/DeptProgressBars';
import StatsCard from '@/Components/StatsCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DashboardStats, Department, DeptStat, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Props = PageProps<{
    stats: DashboardStats;
    deptStats: DeptStat[];
    departments: Department[];
    date: string;
}>;

export default function RapportsIndex({ stats, deptStats, date }: Props) {
    const currentYear  = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    return (
        <AuthenticatedLayout>
            <Head title="Rapports" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-white">Rapports de présence</h1>
                    <Link
                        href={route('reports.monthly', { year: currentYear, month: currentMonth })}
                        className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20"
                    >
                        Rapport mensuel →
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatsCard title="Total" value={stats.total_employees} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} color="blue" />
                    <StatsCard title="Présents" value={stats.present} subtitle={`${stats.attendance_rate}%`} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="green" />
                    <StatsCard title="En retard" value={stats.late} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="yellow" />
                    <StatsCard title="Absents" value={stats.absent} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} color="red" />
                </div>

                <DeptProgressBars departments={deptStats} />

                {/* Actions rapides */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-[#111827] p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Rapport mensuel</h3>
                        <p className="text-sm text-gray-500 mb-4">Visualisez le rapport complet du mois avec les données de chaque employé.</p>
                        <Link href={route('reports.monthly')} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
                            Voir le rapport
                        </Link>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-[#111827] p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Export CSV</h3>
                        <p className="text-sm text-gray-500 mb-4">Exportez les données du mois courant au format CSV pour Excel.</p>
                        <a href={route('reports.export', 'csv')} className="inline-block rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 hover:bg-blue-500/20">
                            Télécharger CSV
                        </a>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
