import { DeptStat } from '@/types';
import React from 'react';

interface DeptProgressBarsProps {
    departments: DeptStat[];
}

/**
 * Barres de progression de présence par département.
 */
export default function DeptProgressBars({ departments }: DeptProgressBarsProps) {
    if (!departments.length) {
        return (
            <div className="rounded-xl border border-white/10 bg-[#111827] p-6">
                <p className="text-sm text-gray-500">Aucun département configuré.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-white/10 bg-[#111827] p-6">
            <h3 className="mb-6 text-lg font-semibold text-white">Présence par département</h3>
            <div className="space-y-4">
                {departments.map((dept) => (
                    <div key={dept.id}>
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-300">{dept.name}</span>
                            <span className="text-sm font-semibold text-white">
                                {dept.present}/{dept.total_employees}
                                <span className="ml-2 text-xs text-emerald-400">
                                    ({dept.attendance_rate}%)
                                </span>
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                            <div
                                className="h-2 rounded-full bg-emerald-500 transition-all duration-700 ease-out"
                                style={{ width: `${dept.attendance_rate}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
