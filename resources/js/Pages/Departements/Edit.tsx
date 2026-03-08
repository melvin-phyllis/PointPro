import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Department, PageProps, User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

type Props = PageProps<{ department: Department; managers: User[] }>;

export default function DepartementEdit({ department, managers }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: department.name,
        manager_id: department.manager_id?.toString() ?? '',
    });

    return (
        <AuthenticatedLayout>
            <Head title={`Modifier — ${department.name}`} />
            <div className="mx-auto max-w-lg space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('departements.index')} className="text-gray-500 hover:text-secondary">← Retour</Link>
                    <h1 className="text-2xl font-bold text-primary">Modifier : {department.name}</h1>
                </div>
                <form onSubmit={e => { e.preventDefault(); put(route('departements.update', department.id)); }} className="rounded-xl border border-theme bg-surface p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Nom du département *</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Manager</label>
                        <select value={data.manager_id} onChange={e => setData('manager_id', e.target.value)} className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500">
                            <option value="">— Aucun manager —</option>
                            {managers.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing} className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-primary hover:bg-emerald-600 disabled:opacity-50">
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <Link href={route('departements.index')} className="rounded-lg border border-theme px-6 py-2 text-sm font-medium text-muted hover:bg-subtle">Annuler</Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
