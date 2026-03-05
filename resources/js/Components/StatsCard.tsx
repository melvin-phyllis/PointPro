import React from 'react';

interface StatsCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray';
    trend?: number; // pourcentage de tendance
}

const colorMap = {
    green:  { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20' },
    yellow: { bg: 'bg-amber-500/10',   icon: 'text-amber-400',   border: 'border-amber-500/20'   },
    red:    { bg: 'bg-red-500/10',     icon: 'text-red-400',     border: 'border-red-500/20'     },
    blue:   { bg: 'bg-blue-500/10',    icon: 'text-blue-400',    border: 'border-blue-500/20'    },
    purple: { bg: 'bg-violet-500/10',  icon: 'text-violet-400',  border: 'border-violet-500/20'  },
    gray:   { bg: 'bg-gray-500/10',    icon: 'text-gray-400',    border: 'border-gray-500/20'    },
};

/**
 * Carte de statistique avec icône et valeur animée.
 */
export default function StatsCard({ title, value, subtitle, icon, color }: StatsCardProps) {
    const colors = colorMap[color];

    return (
        <div className={`relative overflow-hidden rounded-xl border ${colors.border} bg-[#111827] p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-white tabular-nums">{value}</p>
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                    )}
                </div>
                <div className={`rounded-lg p-2.5 ${colors.bg}`}>
                    <div className={`h-6 w-6 ${colors.icon}`}>
                        {icon}
                    </div>
                </div>
            </div>

            {/* Barre décorative en bas */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${colors.bg}`} />
        </div>
    );
}
