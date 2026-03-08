import LocationPicker from '@/Components/LocationPicker';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useGeolocation } from '@/hooks/useGeolocation';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

type Props = PageProps;

export default function ZoneCreate({ }: Props) {
    const { getPosition } = useGeolocation();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        radius_meters: '200',
        is_active: true,
    });

    async function useCurrentPosition() {
        try {
            const coords = await getPosition();
            setData(d => ({ ...d, latitude: coords.latitude.toFixed(8), longitude: coords.longitude.toFixed(8) }));
        } catch { }
    }

    function handleLocationChange(lat: string, lng: string, address?: string) {
        setData(d => ({
            ...d,
            latitude: lat,
            longitude: lng,
            ...(address && !d.address ? { address } : {}),
        }));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Nouvelle zone GPS" />
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('zones.index')} className="text-gray-500 hover:text-secondary">← Retour</Link>
                    <h1 className="text-2xl font-bold text-primary">Nouvelle zone géographique</h1>
                </div>

                <form onSubmit={e => { e.preventDefault(); post(route('zones.store')); }} className="rounded-xl border border-theme bg-surface p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Nom de la zone *</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Ex: Bureau Plateau" className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Adresse</label>
                        <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2} placeholder="Adresse complète de la zone" className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted mb-2">Emplacement sur la carte *</label>
                        <LocationPicker
                            latitude={data.latitude}
                            longitude={data.longitude}
                            radius={parseInt(data.radius_meters) || 200}
                            onLocationChange={handleLocationChange}
                        />
                        {(errors.latitude || errors.longitude) && (
                            <p className="mt-1 text-xs text-red-400">{errors.latitude || errors.longitude}</p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Latitude</label>
                            <input type="number" step="any" value={data.latitude} onChange={e => setData('latitude', e.target.value)} placeholder="5.3364" className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500" readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Longitude</label>
                            <input type="number" step="any" value={data.longitude} onChange={e => setData('longitude', e.target.value)} placeholder="-4.0267" className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500" readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Rayon (m) *</label>
                            <input type="number" min={10} max={10000} value={data.radius_meters} onChange={e => setData('radius_meters', e.target.value)} className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            {errors.radius_meters && <p className="mt-1 text-xs text-red-400">{errors.radius_meters}</p>}
                        </div>
                    </div>

                    <button type="button" onClick={useCurrentPosition} className="text-xs text-emerald-400 hover:text-emerald-300">
                        📍 Utiliser ma position actuelle
                    </button>

                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-surface text-emerald-500" />
                        <label htmlFor="is_active" className="text-sm text-muted">Zone active</label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing} className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-primary hover:bg-emerald-600 disabled:opacity-50">
                            {processing ? 'Création...' : 'Créer la zone'}
                        </button>
                        <Link href={route('zones.index')} className="rounded-lg border border-theme px-6 py-2 text-sm font-medium text-muted hover:bg-subtle">Annuler</Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
