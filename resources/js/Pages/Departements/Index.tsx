import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Department, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Props = PageProps<{ departments: Department[] }>;

export default function DepartementsIndex({ departments }: Props) {
    function handleDelete(id: number) {
        if (!confirm('Supprimer ce département ?')) return;
        router.delete(route('departements.destroy', id));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Départements" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Départements</h1>
                    <Link href={route('departements.create')} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
                        + Nouveau département
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {departments.map(dept => (
                        <div key={dept.id} className="rounded-xl border border-white/10 bg-[#111827] p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{dept.name}</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {dept.employee_count ?? 0} employé(s)
                                    </p>
                                    {dept.manager && (
                                        <p className="mt-2 text-xs text-gray-500">
                                            Manager : {dept.manager.first_name} {dept.manager.last_name}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('departements.edit', dept.id)} className="text-xs text-gray-400 hover:text-gray-200">Modifier</Link>
                                    <button onClick={() => handleDelete(dept.id)} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {departments.length === 0 && (
                        <div className="col-span-3 rounded-xl border border-white/10 bg-[#111827] p-12 text-center text-gray-500">
                            Aucun département configuré.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
