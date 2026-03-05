import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Location, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Props = PageProps<{ locations: Location[] }>;

export default function ZonesIndex({ locations }: Props) {
    function handleDelete(id: number) {
        if (!confirm('Supprimer cette zone ?')) return;
        router.delete(route('zones.destroy', id));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Zones GPS" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Zones géographiques</h1>
                    <Link href={route('zones.create')} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
                        + Nouvelle zone
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {locations.map(loc => (
                        <div key={loc.id} className={`rounded-xl border bg-[#111827] p-5 ${loc.is_active ? 'border-white/10' : 'border-red-500/20 opacity-60'}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <h3 className="text-base font-semibold text-white">{loc.name}</h3>
                                    </div>
                                    {loc.address && <p className="mt-1 text-xs text-gray-500">{loc.address}</p>}
                                    <div className="mt-3 space-y-1 text-xs text-gray-500">
                                        <p>Lat: {loc.latitude.toFixed(6)}, Lng: {loc.longitude.toFixed(6)}</p>
                                        <p>Rayon : {loc.radius_meters} m</p>
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${loc.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                            {loc.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('zones.edit', loc.id)} className="text-xs text-gray-400 hover:text-gray-200">Modifier</Link>
                                    <button onClick={() => handleDelete(loc.id)} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {locations.length === 0 && (
                        <div className="col-span-3 rounded-xl border border-white/10 bg-[#111827] p-12 text-center text-gray-500">
                            Aucune zone géographique configurée.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
