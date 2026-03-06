import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React from 'react';

interface RevenuePoint { month: string; amount: number; }
interface SignupPoint { month: string; count: number; }

interface Stats {
    total_companies: number;
    active_companies: number;
    total_users: number;
    total_attendances_today: number;
    companies_by_plan: Record<string, number>;
    mrr: number;
    revenue_this_month: number;
    revenue_last_month: number;
    new_companies_this_week: number;
    new_companies_this_month: number;
    expiring_soon: number;
    expired_unpaid: number;
    open_tickets: number;
    urgent_tickets: number;
    revenue_chart: RevenuePoint[];
    signups_chart: SignupPoint[];
    recent_payments: { id: number; company_name: string; amount: string; payment_method: string; paid_at: string }[];
    expiring_subscriptions: { company_name: string; plan_name: string; ends_at: string; days_remaining: number }[];
    urgent_ticket_list: { id: number; ticket_number: string; subject: string; company_name: string; created_at: string }[];
}

type Props = PageProps<{ stats: Stats }>;

function fmt(n: number) {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

function StatCard({ label, value, sub, color = 'emerald' }: {
    label: string; value: string | number; sub?: string; color?: 'emerald' | 'blue' | 'amber' | 'red';
}) {
    const textColor = { emerald: 'text-emerald-400', blue: 'text-blue-400', amber: 'text-amber-400', red: 'text-red-400' }[color];
    return (
        <div className="rounded-xl border border-white/10 bg-[#0D1117] p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
            <p className={`mt-2 text-2xl font-bold ${textColor}`}>{value}</p>
            {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
        </div>
    );
}

const methodLabels: Record<string, string> = {
    mobile_money: 'Mobile Money', wave: 'Wave', bank_transfer: 'Virement', cash: 'Espèces', other: 'Autre',
};

export default function AdminDashboard({ stats }: Props) {
    const growth = stats.revenue_last_month > 0
        ? Math.round(((stats.revenue_this_month - stats.revenue_last_month) / stats.revenue_last_month) * 100)
        : null;

    // Auto-refresh toutes les 15s
    React.useEffect(() => {
        const id = setInterval(() => router.reload({ only: ['stats'] }), 5000);
        return () => clearInterval(id);
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Super Admin — Dashboard" />
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Tableau de bord</h1>
                        <p className="text-sm text-gray-400">Vue globale de la plateforme PointPro</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/40">
                        SUPER ADMIN
                    </span>
                </div>

                {/* Stats ligne 1 */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard label="Entreprises actives" value={stats.active_companies} sub={`${stats.total_companies} au total`} color="emerald" />
                    <StatCard label="Utilisateurs" value={stats.total_users} sub={`+${stats.new_companies_this_month} ce mois`} color="blue" />
                    <StatCard label="MRR" value={fmt(stats.mrr)} sub={growth !== null ? `${growth >= 0 ? '+' : ''}${growth}% vs mois dernier` : 'Revenus récurrents'} color="emerald" />
                    <StatCard label="Tickets ouverts" value={stats.open_tickets} sub={`${stats.urgent_tickets} urgents`} color={stats.urgent_tickets > 0 ? 'red' : 'blue'} />
                </div>

                {/* Stats ligne 2 */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard label="Revenus ce mois" value={fmt(stats.revenue_this_month)} color="emerald" />
                    <StatCard label="Pointages aujourd'hui" value={stats.total_attendances_today} color="blue" />
                    <StatCard label="Expirent bientôt" value={stats.expiring_soon} sub="dans les 7 jours" color={stats.expiring_soon > 0 ? 'amber' : 'blue'} />
                    <StatCard label="Abonnements expirés" value={stats.expired_unpaid} color={stats.expired_unpaid > 0 ? 'red' : 'blue'} />
                </div>

                {/* Graphiques */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-[#0D1117] p-5">
                        <h3 className="mb-4 text-sm font-semibold text-white">Revenus — 12 derniers mois</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={stats.revenue_chart}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={v => v >= 1000 ? `${(v as number) / 1000}k` : String(v)} />
                                <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} labelStyle={{ color: '#e5e7eb' }} formatter={(v) => [fmt(v as number), 'Revenus']} />
                                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-[#0D1117] p-5">
                        <h3 className="mb-4 text-sm font-semibold text-white">Nouvelles entreprises — 12 mois</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={stats.signups_chart}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} allowDecimals={false} />
                                <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} labelStyle={{ color: '#e5e7eb' }} formatter={(v) => [v as number, 'Entreprises']} />
                                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Répartition par plan */}
                <div className="rounded-xl border border-white/10 bg-[#0D1117] p-5">
                    <h3 className="mb-4 text-sm font-semibold text-white">Répartition par plan</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            { key: 'starter', label: 'Starter', cls: 'bg-gray-500' },
                            { key: 'business', label: 'Business', cls: 'bg-blue-500' },
                            { key: 'enterprise', label: 'Enterprise', cls: 'bg-emerald-500' },
                            { key: 'custom', label: 'Custom', cls: 'bg-amber-500' },
                        ].map(p => (
                            <div key={p.key} className="rounded-lg border border-white/5 bg-white/[0.02] p-4 text-center">
                                <div className={`mx-auto mb-2 h-2 w-12 rounded-full ${p.cls}`} />
                                <p className="text-lg font-bold text-white">{stats.companies_by_plan[p.key] ?? 0}</p>
                                <p className="text-xs text-gray-500">{p.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Derniers paiements + Expirations */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-[#0D1117] p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white">Derniers paiements</h3>
                            <Link href={route('admin.payments.index')} className="text-xs text-emerald-400 hover:underline">Voir tout →</Link>
                        </div>
                        <div className="space-y-2">
                            {stats.recent_payments.length === 0
                                ? <p className="py-4 text-center text-sm text-gray-500">Aucun paiement</p>
                                : stats.recent_payments.map(p => (
                                    <div key={p.id} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
                                        <div>
                                            <p className="text-sm font-medium text-gray-200">{p.company_name}</p>
                                            <p className="text-xs text-gray-500">{methodLabels[p.payment_method] ?? p.payment_method} · {p.paid_at}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-emerald-400">{p.amount}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-[#0D1117] p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white">Expirent dans 14 jours</h3>
                            <Link href={route('admin.companies.index')} className="text-xs text-emerald-400 hover:underline">Voir tout →</Link>
                        </div>
                        <div className="space-y-2">
                            {stats.expiring_subscriptions.length === 0
                                ? <p className="py-4 text-center text-sm text-gray-500">Aucune expiration imminente</p>
                                : stats.expiring_subscriptions.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
                                        <div>
                                            <p className="text-sm font-medium text-gray-200">{s.company_name}</p>
                                            <p className="text-xs text-gray-500">{s.plan_name} · expire {s.ends_at}</p>
                                        </div>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.days_remaining <= 3 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            J-{s.days_remaining}
                                        </span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                {/* Tickets urgents */}
                {stats.urgent_ticket_list.length > 0 && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-red-400">⚠ Tickets urgents</h3>
                            <Link href={route('admin.tickets.index')} className="text-xs text-emerald-400 hover:underline">Voir tout →</Link>
                        </div>
                        <div className="space-y-2">
                            {stats.urgent_ticket_list.map(t => (
                                <Link key={t.id} href={route('admin.tickets.show', t.id)} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 hover:bg-white/5">
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">{t.subject}</p>
                                        <p className="text-xs text-gray-500">{t.ticket_number} · {t.company_name} · {t.created_at}</p>
                                    </div>
                                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
