import { WeeklyStat } from '@/types';
import React from 'react';

interface WeeklyChartProps {
    data: WeeklyStat[];
}

/**
 * Graphique de présence hebdomadaire sous forme de barres.
 */
export default function WeeklyChart({ data }: WeeklyChartProps) {
    if (!data.length) return null;

    const maxEmployees = Math.max(...data.map(d => d.total_employees), 1);

    return (
        <div className="rounded-xl border border-white/10 bg-[#111827] p-6">
            <h3 className="mb-6 text-lg font-semibold text-white">Présence cette semaine</h3>
            <div className="flex items-end justify-between gap-2 h-40">
                {data.map((day) => {
                    const presentH  = (day.present / maxEmployees) * 100;
                    const absentH   = (day.absent  / maxEmployees) * 100;

                    return (
                        <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                            {/* Tooltip-like info */}
                            <div className="text-center text-xs text-gray-500">
                                {day.present}/{day.total_employees}
                            </div>

                            {/* Barre */}
                            <div className="relative w-full flex flex-col justify-end h-28 rounded-md overflow-hidden bg-gray-800/50">
                                <div
                                    className="w-full bg-emerald-500/30 transition-all duration-500 ease-out"
                                    style={{ height: `${Math.min(absentH, 100)}%` }}
                                />
                                <div
                                    className="w-full bg-emerald-500 transition-all duration-500 ease-out"
                                    style={{ height: `${Math.min(presentH, 100)}%` }}
                                />
                            </div>

                            {/* Jour */}
                            <span className="text-xs font-medium text-gray-400">{day.day_name}</span>
                        </div>
                    );
                })}
            </div>

            {/* Légende */}
            <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-xs text-gray-400">Présents</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500/30" />
                    <span className="text-xs text-gray-400">Absents</span>
                </div>
            </div>
        </div>
    );
}
