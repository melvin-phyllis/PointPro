import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface MonthlyReport {
    year: number;
    month: number;
    month_name: string;
    total_workdays: number;
    summary: { total: number; present: number; late: number; absent: number; excused: number };
    avg_worked_hours: number;
    total_overtime: number;
}

interface EmployeeRow {
    id: number;
    full_name: string;
    department?: string;
    present_count: number;
    late_count: number;
    absent_count: number;
    total_hours: number;
    overtime_hours: number;
    total_late_min: number;
    attendance_rate: number;
}

type Props = PageProps<{
    report: MonthlyReport;
    employees: EmployeeRow[];
    year: number;
    month: number;
}>;

export default function Mensuel({ report, employees, year, month }: Props) {
    const prevMonth = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
    const nextMonth = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

    return (
        <AuthenticatedLayout>
            <Head title={`Rapport — ${report.month_name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link href={route('reports.index')} className="text-gray-500 hover:text-gray-300">← Retour</Link>
                        <h1 className="text-2xl font-bold text-white capitalize">{report.month_name}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={route('reports.monthly', prevMonth)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-gray-400 hover:bg-white/5">
                            ← Précédent
                        </Link>
                        <Link href={route('reports.monthly', nextMonth)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-gray-400 hover:bg-white/5">
                            Suivant →
                        </Link>
                        <a
                            href={route('reports.export', { format: 'csv', year, month })}
                            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-gray-400 hover:bg-white/5"
                        >
                            CSV
                        </a>
                        <a
                            href={route('reports.export', { format: 'xlsx', year, month })}
                            className="rounded-lg bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20"
                        >
                            Excel
                        </a>
                        <a
                            href={route('reports.export', { format: 'pdf', year, month })}
                            className="rounded-lg bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/20"
                        >
                            PDF
                        </a>
                    </div>
                </div>

                {/* Résumé */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        { label: 'Jours ouvrés', value: report.total_workdays, color: 'text-white' },
                        { label: 'Présences totales', value: report.summary.present, color: 'text-emerald-400' },
                        { label: 'Retards', value: report.summary.late, color: 'text-amber-400' },
                        { label: 'Absences', value: report.summary.absent, color: 'text-red-400' },
                    ].map(s => (
                        <div key={s.label} className="rounded-xl border border-white/10 bg-[#111827] p-4 text-center">
                            <p className="text-xs text-gray-500">{s.label}</p>
                            <p className={`mt-1 text-3xl font-bold ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tableau employés */}
                <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                        <h3 className="text-base font-semibold text-white">Détail par employé</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-left">
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Employé</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Présents</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Retards</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Absents</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Total heures</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Taux</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {employees.map(emp => (
                                    <tr key={emp.id} className="hover:bg-white/[0.02]">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-200">{emp.full_name}</p>
                                            <p className="text-xs text-gray-500">{emp.department ?? '—'}</p>
                                        </td>
                                        <td className="px-4 py-3 text-emerald-400">{emp.present_count}</td>
                                        <td className="px-4 py-3 text-amber-400">{emp.late_count}</td>
                                        <td className="px-4 py-3 text-red-400">{emp.absent_count}</td>
                                        <td className="px-4 py-3 text-gray-300">{emp.total_hours}h</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-700">
                                                    <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${emp.attendance_rate}%` }} />
                                                </div>
                                                <span className="text-gray-400 text-xs">{emp.attendance_rate}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {employees.length === 0 && (
                            <p className="p-8 text-center text-gray-500">Aucune donnée pour ce mois.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
