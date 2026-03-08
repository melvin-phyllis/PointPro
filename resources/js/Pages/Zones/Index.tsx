import ConfirmModal from '@/Components/ConfirmModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Location, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Props = PageProps<{ locations: Location[] }>;

export default function ZonesIndex({ locations }: Props) {
    const [zoneToDelete, setZoneToDelete] = useState<number | null>(null);

    function handleDelete() {
        if (zoneToDelete === null) return;
        router.delete(route('zones.destroy', zoneToDelete), {
            onSuccess: () => setZoneToDelete(null),
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Zones GPS" />
            <div className="space-y-6 animate-fade-up">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
                            <MapPin size={20} className="text-brand-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-primary">Zones GPS</h1>
                            <p className="text-sm text-secondary">{locations.length} zone(s) configuree(s)</p>
                        </div>
                    </div>
                    <Link href={route('zones.create')} className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-primary hover:bg-brand-600 transition shadow-sm">
                        <Plus size={16} />
                        Nouvelle zone
                    </Link>
                </div>

                {locations.length === 0 ? (
                    <div className="rounded-xl border border-theme bg-surface p-12 text-center shadow-sm">
                        <MapPin size={40} className="mx-auto mb-3 text-secondary dark:text-gray-600" />
                        <p className="text-sm font-medium text-secondary">Aucune zone geographique configuree.</p>
                        <Link href={route('zones.create')} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition">
                            <Plus size={14} />
                            Creer une zone
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {locations.map(loc => (
                            <div key={loc.id} className={`rounded-xl border bg-surface p-5 shadow-sm transition-all hover:shadow-md ${loc.is_active ? 'border-theme' : 'border-red-200 dark:border-red-500/20 opacity-70'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MapPin size={16} className="text-brand-500 flex-shrink-0" />
                                            <h3 className="text-base font-semibold text-primary truncate">{loc.name}</h3>
                                        </div>
                                        {loc.address && <p className="text-xs text-secondary mb-2">{loc.address}</p>}
                                        <div className="space-y-1 text-xs text-muted">
                                            <p>Lat: {loc.latitude.toFixed(6)}, Lng: {loc.longitude.toFixed(6)}</p>
                                            <p>Rayon : <span className="font-medium text-secondary">{loc.radius_meters} m</span></p>
                                        </div>
                                        <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${loc.is_active ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-500/20 text-gray-500'}`}>
                                            {loc.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 ml-3">
                                        <Link href={route('zones.edit', loc.id)} className="rounded-lg px-2 py-1 text-xs font-medium text-secondary hover:bg-gray-100 dark:hover:bg-subtle hover:text-primary transition">
                                            Modifier
                                        </Link>
                                        <button onClick={() => setZoneToDelete(loc.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
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
                show={zoneToDelete !== null}
                onClose={() => setZoneToDelete(null)}
                onConfirm={handleDelete}
                title="Supprimer la zone GPS"
                description="Êtes-vous sûr de vouloir supprimer cette zone ? Attention, cela pourrait impacter les pointages existants pour les employés liés à cette zone."
                confirmText="Supprimer"
            />
        </AuthenticatedLayout >
    );
}
