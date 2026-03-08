import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Department, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Plus, Trash2, User } from 'lucide-react';
import { useState } from 'react';

type Props = PageProps<{ departments: Department[] }>;

export default function DepartementsIndex({ departments }: Props) {
    const [deptToDelete, setDeptToDelete] = useState<number | null>(null);

    function handleDelete() {
        if (deptToDelete === null) return;
        router.delete(route('departements.destroy', deptToDelete), {
            onSuccess: () => setDeptToDelete(null),
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Departements" />
            <div className="space-y-6 animate-fade-up">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
                            <Building2 size={20} className="text-brand-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-primary">Departements</h1>
                            <p className="text-sm text-secondary">{departments.length} departement(s)</p>
                        </div>
                    </div>
                    <Link href={route('departements.create')} className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-primary hover:bg-brand-600 transition shadow-sm">
                        <Plus size={16} />
                        Nouveau departement
                    </Link>
                </div>

                {departments.length === 0 ? (
                    <div className="rounded-xl border border-theme bg-surface p-12 text-center shadow-sm">
                        <Building2 size={40} className="mx-auto mb-3 text-secondary dark:text-gray-600" />
                        <p className="text-sm font-medium text-secondary">Aucun departement configure.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {departments.map(dept => (
                            <div key={dept.id} className="group rounded-xl border border-theme bg-surface p-5 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-base font-semibold text-primary truncate">{dept.name}</h3>
                                        <p className="mt-1 flex items-center gap-1 text-sm text-secondary">
                                            <User size={13} />
                                            {dept.employee_count ?? 0} employe(s)
                                        </p>
                                        {dept.manager && (
                                            <p className="mt-1.5 text-xs text-muted">
                                                Manager : <span className="font-medium text-secondary">{dept.manager.first_name} {dept.manager.last_name}</span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={route('departements.edit', dept.id)} className="rounded-lg px-2 py-1 text-xs font-medium text-secondary hover:bg-gray-100 dark:hover:bg-subtle hover:text-primary transition">
                                            Modifier
                                        </Link>
                                        <button onClick={() => setDeptToDelete(dept.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                show={deptToDelete !== null}
                onClose={() => setDeptToDelete(null)}
                onConfirm={handleDelete}
                title="Supprimer le département"
                description="Êtes-vous sûr de vouloir supprimer ce département ? Tous les employés associés seront affectés."
                confirmText="Supprimer"
            />
        </AuthenticatedLayout >
    );
}
