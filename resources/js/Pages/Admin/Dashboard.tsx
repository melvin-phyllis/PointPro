import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Stats = {
    total_companies:  number;
    active_companies: number;
    total_users:      number;
    today_pointages:  number;
    monthly_revenue:  number;
};

type RecentCompany = {
    id:          number;
    name:        string;
    plan:        string;
    is_active:   boolean;
    users_count: number;
    created_at:  string;
};

type GrowthPoint = { month: string; count: number };

type Props = PageProps<{
    stats:           Stats;
    byPlan:          Record<string, number>;
    recentCompanies: RecentCompany[];
    growth:          GrowthPoint[];
}>;

const planColors: Record<string, string> = {
    starter:    'bg-gray-500/20 text-gray-400',
    business:   'bg-blue-500/20 text-blue-400',
    enterprise: 'bg-purple-500/20 text-purple-400',
    custom:     'bg-amber-500/20 text-amber-400',
};

const planLabels: Record<string, string> = {
    starter:    'Starter',
    business:   'Business',
    enterprise: 'Enterprise',
    custom:     'Custom',
};

const PLAN_BAR_COLORS: Record<string, string> = {
    starter:    '#6B7280',
    business:   '#3B82F6',
    enterprise: '#8B5CF6',
    custom:     '#F59E0B',
};

function StatCard({ label, value, sub, color = 'emerald' }: { label: string; value: string | number; sub?: string; color?: string }) {
    const ring: Record<string, string> = {
        emerald: 'border-emerald-500/20 bg-emerald-500/5',
        blue:    'border-blue-500/20 bg-blue-500/5',
        purple:  'border-purple-500/20 bg-purple-500/5',
        amber:   'border-amber-500/20 bg-amber-500/5',
    };
    const text: Record<string, string> = {
        emerald: 'text-emerald-400',
        blue:    'text-blue-400',
        purple:  'text-purple-400',
        amber:   'text-amber-400',
    };
    return (
        <div className={`rounded-xl border p-5 ${ring[color]}`}>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`mt-1 text-3xl font-bold ${text[color]}`}>{value}</p>
            {sub && <p className="mt-1 text-xs text-gray-600">{sub}</p>}
        </div>
    );
}

export default function AdminDashboard({ stats, byPlan, recentCompanies, growth }: Props) {
    const planData = Object.entries(byPlan).map(([plan, count]) => ({
        plan: planLabels[plan] ?? plan,
        count,
        color: PLAN_BAR_COLORS[plan] ?? '#6B7280',
    }));

    return (
        <AuthenticatedLayout>
            <Head title="Super Admin — Dashboard" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Dashboard Super Admin</h1>
                        <p className="mt-1 text-sm text-gray-500">Vue globale de la plateforme PointPro</p>
                    </div>
                    <Link
                        href={route('admin.companies.index')}
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                        Gérer les entreprises →
                    </Link>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                    <StatCard label="Entreprises totales"  value={stats.total_companies}  color="emerald" />
                    <StatCard label="Entreprises actives"  value={stats.active_companies} sub={`${stats.total_companies - stats.active_companies} inactives`} color="blue" />
                    <StatCard label="Utilisateurs totaux"  value={stats.total_users}       color="purple" />
                    <StatCard label="Pointages aujourd'hui" value={stats.today_pointages}  color="amber" />
                    <StatCard
                        label="Revenus mensuels estimés"
                        value={stats.monthly_revenue.toLocaleString('fr-FR') + ' FCFA'}
                        color="emerald"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Croissance inscriptions */}
                    <div className="rounded-xl border border-white/10 bg-[#111827] p-6">
                        <h2 className="mb-4 text-sm font-semibold text-gray-300">Nouvelles entreprises (6 derniers mois)</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={growth} barSize={28}>
                                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} width={24} />
                                <Tooltip
                                    contentStyle={{ background: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                                    labelStyle={{ color: '#D1D5DB' }}
                                    itemStyle={{ color: '#10B981' }}
                                    formatter={(v: number | undefined) => [v ?? 0, 'entreprises']}
                                />
                                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Répartition par plan */}
                    <div className="rounded-xl border border-white/10 bg-[#111827] p-6">
                        <h2 className="mb-4 text-sm font-semibold text-gray-300">Répartition par plan</h2>
                        {planData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={planData} barSize={36}>
                                        <XAxis dataKey="plan" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} width={24} />
                                        <Tooltip
                                            contentStyle={{ background: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                                            labelStyle={{ color: '#D1D5DB' }}
                                            itemStyle={{ color: '#D1D5DB' }}
                                            formatter={(v: number | undefined) => [v ?? 0, 'entreprises']}
                                        />
                                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                            {planData.map((entry) => (
                                                <Cell key={entry.plan} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {planData.map(p => (
                                        <div key={p.plan} className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                                            {p.plan} ({p.count})
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="mt-12 text-center text-sm text-gray-600">Aucune donnée</p>
                        )}
                    </div>
                </div>

                {/* Dernières entreprises inscrites */}
                <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
                    <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-300">Dernières inscriptions</h2>
                        <Link href={route('admin.companies.index')} className="text-xs text-emerald-400 hover:text-emerald-300">
                            Voir tout →
                        </Link>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5 text-left">
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Entreprise</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Plan</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Employés</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Inscrit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentCompanies.map(c => (
                                <tr key={c.id} className="hover:bg-white/[0.02]">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-200">{c.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${planColors[c.plan] ?? 'bg-gray-500/20 text-gray-400'}`}>
                                            {planLabels[c.plan] ?? c.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{c.users_count}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {c.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">{c.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
