import React from 'react';

interface StatsCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray';
    trend?: number;
}

const colorMap = {
    green:  { bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-500/20' },
    yellow: { bg: 'bg-amber-50 dark:bg-amber-500/10',     icon: 'text-amber-600 dark:text-amber-400',     border: 'border-amber-100 dark:border-amber-500/20'    },
    red:    { bg: 'bg-red-50 dark:bg-red-500/10',         icon: 'text-red-600 dark:text-red-400',         border: 'border-red-100 dark:border-red-500/20'        },
    blue:   { bg: 'bg-blue-50 dark:bg-blue-500/10',       icon: 'text-blue-600 dark:text-blue-400',       border: 'border-blue-100 dark:border-blue-500/20'      },
    purple: { bg: 'bg-violet-50 dark:bg-violet-500/10',   icon: 'text-violet-600 dark:text-violet-400',   border: 'border-violet-100 dark:border-violet-500/20'  },
    gray:   { bg: 'bg-gray-50 dark:bg-gray-500/10',       icon: 'text-gray-600 dark:text-muted',       border: 'border-gray-100 dark:border-gray-500/20'      },
};

export default function StatsCard({ title, value, subtitle, icon, color }: StatsCardProps) {
    const colors = colorMap[color];
    return (
        <div className={`relative overflow-hidden rounded-xl border ${colors.border} bg-white dark:bg-surface p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">{title}</p>
                    <p className="mt-2 text-2xl font-bold text-primary tabular-nums">{value}</p>
                    {subtitle && <p className="mt-1 text-xs text-secondary">{subtitle}</p>}
                </div>
                <div className={`rounded-xl p-2.5 ${colors.bg} flex-shrink-0`}>
                    <div className={`h-5 w-5 ${colors.icon}`}>{icon}</div>
                </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${colors.bg}`} />
        </div>
    );
}
