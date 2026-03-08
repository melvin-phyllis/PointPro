import { WeeklyStat } from '@/types';

export default function WeeklyChart({ data }: { data: WeeklyStat[] }) {
    if (!data.length) return null;
    const maxEmployees = Math.max(...data.map(d => d.total_employees), 1);

    return (
        <div className="rounded-xl border border-theme bg-surface p-6 shadow-sm">
            <h3 className="mb-5 text-base font-semibold text-primary">Presence cette semaine</h3>
            <div className="flex items-end justify-between gap-2 h-36">
                {data.map(day => {
                    const presentH = (day.present / maxEmployees) * 100;
                    const absentH  = (day.absent  / maxEmployees) * 100;
                    return (
                        <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                            <div className="text-center text-xs text-muted">{day.present}/{day.total_employees}</div>
                            <div className="relative w-full flex flex-col justify-end h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800/50">
                                <div className="w-full bg-brand-200 dark:bg-brand-500/30 transition-all duration-500" style={{ height: `${Math.min(absentH, 100)}%` }} />
                                <div className="w-full bg-brand-500 transition-all duration-500" style={{ height: `${Math.min(presentH, 100)}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-secondary">{day.day_name}</span>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 flex items-center gap-5">
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-brand-500" />
                    <span className="text-xs text-secondary">Presents</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-brand-200 dark:bg-brand-500/30" />
                    <span className="text-xs text-secondary">Absents</span>
                </div>
            </div>
        </div>
    );
}
