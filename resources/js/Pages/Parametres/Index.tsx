import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Company, CompanySettings, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';

type Props = PageProps<{
    company: Company;
    defaultSettings: CompanySettings;
}>;

export default function ParametresIndex({ company, defaultSettings }: Props) {
    const settings = { ...defaultSettings, ...(company.settings ?? {}) };

    const { data, setData, put, processing, errors } = useForm({
        name:    company.name,
        email:   company.email,
        phone:   company.phone ?? '',
        address: company.address ?? '',
        settings: {
            work_start:                settings.work_start,
            work_end:                  settings.work_end,
            late_tolerance_minutes:    settings.late_tolerance_minutes,
            early_check_in_minutes:    settings.early_check_in_minutes,
            auto_absent_after_minutes: settings.auto_absent_after_minutes,
            lunch_break_minutes:       settings.lunch_break_minutes,
            timezone:                  settings.timezone,
            working_days:              settings.working_days ?? ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        },
    });

    const allDays = [
        { key: 'monday',    label: 'Lundi' },
        { key: 'tuesday',   label: 'Mardi' },
        { key: 'wednesday', label: 'Mercredi' },
        { key: 'thursday',  label: 'Jeudi' },
        { key: 'friday',    label: 'Vendredi' },
        { key: 'saturday',  label: 'Samedi' },
        { key: 'sunday',    label: 'Dimanche' },
    ];

    function toggleDay(day: string) {
        const current = data.settings.working_days;
        const updated  = current.includes(day)
            ? current.filter(d => d !== day)
            : [...current, day];
        setData('settings', { ...data.settings, working_days: updated });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('settings.update'));
    }

    function inputClass(error?: string) {
        return `w-full rounded-lg border ${error ? 'border-red-500/50' : 'border-white/10'} bg-[#0D1117] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500`;
    }

    return (
        <AuthenticatedLayout>
            <Head title="Paramètres" />

            <div className="mx-auto max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold text-white">Paramètres de l'entreprise</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations générales */}
                    <div className="rounded-xl border border-white/10 bg-[#111827] p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white">Informations générales</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Nom de l'entreprise *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass(errors.name)} />
                            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email *</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass(errors.email)} />
                                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Téléphone</label>
                                <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass()} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Adresse</label>
                            <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2} className={inputClass()} />
                        </div>
                    </div>

                    {/* Horaires */}
                    <div className="rounded-xl border border-white/10 bg-[#111827] p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white">Horaires de travail</h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Heure de début</label>
                                <input
                                    type="time"
                                    value={data.settings.work_start}
                                    onChange={e => setData('settings', { ...data.settings, work_start: e.target.value })}
                                    className={inputClass()}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Heure de fin</label>
                                <input
                                    type="time"
                                    value={data.settings.work_end}
                                    onChange={e => setData('settings', { ...data.settings, work_end: e.target.value })}
                                    className={inputClass()}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Tolérance retard (min)</label>
                                <input
                                    type="number"
                                    min={0} max={120}
                                    value={data.settings.late_tolerance_minutes}
                                    onChange={e => setData('settings', { ...data.settings, late_tolerance_minutes: +e.target.value })}
                                    className={inputClass()}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Pause déjeuner (min)</label>
                                <input
                                    type="number"
                                    min={0} max={120}
                                    value={data.settings.lunch_break_minutes}
                                    onChange={e => setData('settings', { ...data.settings, lunch_break_minutes: +e.target.value })}
                                    className={inputClass()}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Absent après (min)</label>
                                <input
                                    type="number"
                                    min={30} max={480}
                                    value={data.settings.auto_absent_after_minutes}
                                    onChange={e => setData('settings', { ...data.settings, auto_absent_after_minutes: +e.target.value })}
                                    className={inputClass()}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Fuseau horaire</label>
                            <select
                                value={data.settings.timezone}
                                onChange={e => setData('settings', { ...data.settings, timezone: e.target.value })}
                                className={inputClass()}
                            >
                                <option value="Africa/Abidjan">Africa/Abidjan</option>
                                <option value="Africa/Dakar">Africa/Dakar</option>
                                <option value="Africa/Lagos">Africa/Lagos</option>
                                <option value="Africa/Accra">Africa/Accra</option>
                                <option value="Europe/Paris">Europe/Paris</option>
                                <option value="UTC">UTC</option>
                            </select>
                        </div>
                    </div>

                    {/* Jours ouvrés */}
                    <div className="rounded-xl border border-white/10 bg-[#111827] p-6 space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Jours ouvrés</h2>
                            <p className="mt-1 text-sm text-gray-500">Les absences sont marquées automatiquement uniquement ces jours-là.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {allDays.map(day => {
                                const active = data.settings.working_days.includes(day.key);
                                return (
                                    <button
                                        key={day.key}
                                        type="button"
                                        onClick={() => toggleDay(day.key)}
                                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                                            active
                                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                                : 'border-white/10 bg-[#0D1117] text-gray-500 hover:border-white/20'
                                        }`}
                                    >
                                        {day.label}
                                    </button>
                                );
                            })}
                        </div>
                        {data.settings.working_days.length === 0 && (
                            <p className="text-xs text-red-400">Sélectionnez au moins un jour ouvré.</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
                        >
                            {processing ? 'Enregistrement...' : 'Sauvegarder'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
