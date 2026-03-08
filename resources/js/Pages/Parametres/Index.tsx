import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Company, CompanySettings, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Building2, Clock, Save } from 'lucide-react';

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
        const updated  = current.includes(day) ? current.filter(d => d !== day) : [...current, day];
        setData('settings', { ...data.settings, working_days: updated });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('settings.update'));
    }

    const fieldClass = (error?: string) =>
        `w-full rounded-xl border ${error ? 'border-red-300 dark:border-red-500/50' : 'border-theme'} bg-subtle px-3 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition`;

    return (
        <AuthenticatedLayout>
            <Head title="Parametres" />
            <div className="mx-auto max-w-3xl space-y-6 animate-fade-up">

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
                        <Building2 size={20} className="text-brand-500" />
                    </div>
                    <h1 className="text-xl font-bold text-primary">Parametres de l'entreprise</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Informations generales */}
                    <section className="rounded-xl border border-theme bg-surface p-6 space-y-4 shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-secondary">Informations generales</h2>

                        <div>
                            <label className="block text-sm font-medium text-primary mb-1">Nom de l'entreprise *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={fieldClass(errors.name)} />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-primary mb-1">Email *</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={fieldClass(errors.email)} />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary mb-1">Telephone</label>
                                <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className={fieldClass()} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-primary mb-1">Adresse</label>
                            <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2} className={fieldClass()} />
                        </div>
                    </section>

                    {/* Horaires */}
                    <section className="rounded-xl border border-theme bg-surface p-6 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-brand-500" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-secondary">Horaires de travail</h2>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-primary mb-1">Heure de debut</label>
                                <input type="time" value={data.settings.work_start} onChange={e => setData('settings', { ...data.settings, work_start: e.target.value })} className={fieldClass()} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary mb-1">Heure de fin</label>
                                <input type="time" value={data.settings.work_end} onChange={e => setData('settings', { ...data.settings, work_end: e.target.value })} className={fieldClass()} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-primary mb-1">Tolerance retard (min)</label>
                                <input type="number" min={0} max={120} value={data.settings.late_tolerance_minutes} onChange={e => setData('settings', { ...data.settings, late_tolerance_minutes: +e.target.value })} className={fieldClass()} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary mb-1">Pause dejeuner (min)</label>
                                <input type="number" min={0} max={120} value={data.settings.lunch_break_minutes} onChange={e => setData('settings', { ...data.settings, lunch_break_minutes: +e.target.value })} className={fieldClass()} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary mb-1">Absent apres (min)</label>
                                <input type="number" min={30} max={480} value={data.settings.auto_absent_after_minutes} onChange={e => setData('settings', { ...data.settings, auto_absent_after_minutes: +e.target.value })} className={fieldClass()} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-primary mb-1">Fuseau horaire</label>
                            <select value={data.settings.timezone} onChange={e => setData('settings', { ...data.settings, timezone: e.target.value })} className={fieldClass()}>
                                <option value="Africa/Abidjan">Africa/Abidjan</option>
                                <option value="Africa/Dakar">Africa/Dakar</option>
                                <option value="Africa/Lagos">Africa/Lagos</option>
                                <option value="Africa/Accra">Africa/Accra</option>
                                <option value="Europe/Paris">Europe/Paris</option>
                                <option value="UTC">UTC</option>
                            </select>
                        </div>
                    </section>

                    {/* Jours ouvres */}
                    <section className="rounded-xl border border-theme bg-surface p-6 space-y-4 shadow-sm">
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-secondary">Jours ouvres</h2>
                            <p className="mt-1 text-sm text-muted">Les absences sont marquees automatiquement uniquement ces jours-la.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allDays.map(day => {
                                const active = data.settings.working_days.includes(day.key);
                                return (
                                    <button
                                        key={day.key}
                                        type="button"
                                        onClick={() => toggleDay(day.key)}
                                        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                                            active
                                                ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                                                : 'border-theme bg-subtle text-secondary hover:border-brand-300 dark:hover:border-brand-700'
                                        }`}
                                    >
                                        {day.label}
                                    </button>
                                );
                            })}
                        </div>
                        {data.settings.working_days.length === 0 && (
                            <p className="text-xs text-red-500">Selectionnez au moins un jour ouvre.</p>
                        )}
                    </section>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-primary hover:bg-brand-600 transition shadow-sm disabled:opacity-50"
                    >
                        <Save size={15} />
                        {processing ? 'Enregistrement...' : 'Sauvegarder'}
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
