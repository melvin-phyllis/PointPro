import { DeptStat } from '@/types';

export default function DeptProgressBars({ departments }: { departments: DeptStat[] }) {
    if (!departments.length) {
        return (
            <div className="rounded-xl border border-theme bg-surface p-6 shadow-sm">
                <p className="text-sm text-secondary">Aucun departement configure.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-theme bg-surface p-6 shadow-sm">
            <h3 className="mb-5 text-base font-semibold text-primary">Presence par departement</h3>
            <div className="space-y-4">
                {departments.map(dept => (
                    <div key={dept.id}>
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-sm font-medium text-primary">{dept.name}</span>
                            <span className="text-sm font-semibold text-primary tabular-nums">
                                {dept.present}/{dept.total_employees}
                                <span className="ml-2 text-xs font-medium text-brand-600 dark:text-brand-400">({dept.attendance_rate}%)</span>
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                            <div
                                className="h-2 rounded-full bg-brand-500 transition-all duration-700 ease-out"
                                style={{ width: `${dept.attendance_rate}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
