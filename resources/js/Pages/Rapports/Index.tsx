import DeptProgressBars from '@/Components/DeptProgressBars';
import StatsCard from '@/Components/StatsCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DashboardStats, Department, DeptStat, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, CheckCircle2, Clock, Download, FileText, Users2, XCircle } from 'lucide-react';

type Props = PageProps<{
    stats: DashboardStats;
    deptStats: DeptStat[];
    departments: Department[];
    date: string;
}>;

export default function RapportsIndex({ stats, deptStats }: Props) {
    const currentYear  = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    return (
        <AuthenticatedLayout>
            <Head title="Rapports" />
            <div className="space-y-6 animate-fade-up">

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
                            <BarChart3 size={20} className="text-brand-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-primary">Rapports de presence</h1>
                            <p className="text-sm text-secondary">Statistiques et exports</p>
                        </div>
                    </div>
                    <Link
                        href={route('reports.monthly', { year: currentYear, month: currentMonth })}
                        className="flex items-center gap-2 rounded-xl bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition"
                    >
                        <FileText size={15} />
                        Rapport mensuel
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatsCard title="Total employes" value={stats.total_employees} icon={<Users2 />}      color="blue"   />
                    <StatsCard title="Presents"        value={stats.present}        subtitle={`${stats.attendance_rate}%`} icon={<CheckCircle2 />} color="green"  />
                    <StatsCard title="En retard"       value={stats.late}           icon={<Clock />}       color="yellow" />
                    <StatsCard title="Absents"         value={stats.absent}         icon={<XCircle />}     color="red"    />
                </div>

                <DeptProgressBars departments={deptStats} />

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-theme bg-surface p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-primary mb-2">Rapport mensuel</h3>
                        <p className="text-sm text-secondary mb-4">Visualisez le rapport complet du mois avec les donnees de chaque employe.</p>
                        <Link href={route('reports.monthly')} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-primary hover:bg-brand-600 transition shadow-sm">
                            <FileText size={14} />
                            Voir le rapport
                        </Link>
                    </div>
                    <div className="rounded-xl border border-theme bg-surface p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-primary mb-2">Export CSV</h3>
                        <p className="text-sm text-secondary mb-4">Exportez les donnees du mois courant au format CSV pour Excel.</p>
                        <a href={route('reports.export', 'csv')} className="inline-flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition">
                            <Download size={14} />
                            Telecharger CSV
                        </a>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
