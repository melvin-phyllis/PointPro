import { useEffect, useRef } from 'react';

interface GpsPoint {
    id: number;
    name: string;
    lat: number;
    lng: number;
    status: 'present' | 'late' | 'absent' | 'half_day' | 'excused';
    check_in: string;
    geo_ok: boolean;
}

interface Zone {
    id: number;
    name: string;
    lat: number;
    lng: number;
    radius: number;
}

interface Props {
    gpsPoints: GpsPoint[];
    zones: Zone[];
}

const STATUS_COLORS: Record<string, string> = {
    present: '#10b981',
    late:    '#f59e0b',
    absent:  '#ef4444',
    half_day:'#8b5cf6',
    excused: '#6b7280',
};

export default function AttendanceMap({ gpsPoints, zones }: Props) {
    const mapRef    = useRef<HTMLDivElement>(null);
    const mapObj    = useRef<any>(null);

    useEffect(() => {
        if (!mapRef.current || mapObj.current) return;

        // Import dynamique pour éviter les erreurs SSR
        import('leaflet').then((L) => {
            // Fix icônes Leaflet avec Vite
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            });

            // Centrage par défaut : Abidjan
            const defaultCenter: [number, number] = gpsPoints.length > 0
                ? [gpsPoints[0].lat, gpsPoints[0].lng]
                : [5.3364, -4.0267];

            const map = L.map(mapRef.current!, {
                center: defaultCenter,
                zoom:   14,
                zoomControl: true,
            });

            mapObj.current = map;

            // Tuiles OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            // Cercles des zones géofencing
            zones.forEach((zone) => {
                L.circle([zone.lat, zone.lng], {
                    radius:      zone.radius,
                    color:       '#10b981',
                    fillColor:   '#10b981',
                    fillOpacity: 0.08,
                    weight:      2,
                    dashArray:   '6 4',
                }).addTo(map).bindPopup(
                    `<strong>${zone.name}</strong><br>Rayon : ${zone.radius}m`
                );

                // Marqueur centre de zone
                L.circleMarker([zone.lat, zone.lng], {
                    radius:      5,
                    color:       '#10b981',
                    fillColor:   '#10b981',
                    fillOpacity: 1,
                    weight:      2,
                }).addTo(map);
            });

            // Marqueurs des employés
            gpsPoints.forEach((point) => {
                const color = STATUS_COLORS[point.status] ?? '#6b7280';
                const icon = L.divIcon({
                    className: '',
                    html: `<div style="
                        width:32px;height:32px;border-radius:50% 50% 50% 0;
                        background:${color};border:2px solid #fff;
                        transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,.4);
                    "></div>`,
                    iconSize:   [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor:[0, -36],
                });

                L.marker([point.lat, point.lng], { icon })
                    .addTo(map)
                    .bindPopup(`
                        <strong>${point.name}</strong><br>
                        Arrivée : ${point.check_in}<br>
                        Statut : ${point.status}<br>
                        ${point.geo_ok ? '✅ Dans la zone' : '⚠️ Hors zone'}
                    `);
            });

            // Ajuster le zoom pour inclure tous les points
            if (gpsPoints.length > 1) {
                const bounds = L.latLngBounds(gpsPoints.map(p => [p.lat, p.lng]));
                map.fitBounds(bounds, { padding: [40, 40] });
            }
        });

        return () => {
            mapObj.current?.remove();
            mapObj.current = null;
        };
    }, []);

    return (
        <div className="rounded-xl border border-theme bg-surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-theme px-6 py-4">
                <h3 className="text-base font-semibold text-primary">Carte des pointages</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500"></span>Présent
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400"></span>Retard
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-400"></span>Absent
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400/60">
                        <span className="inline-block h-2.5 w-2.5 rounded-full border border-dashed border-emerald-500"></span>Zone
                    </span>
                </div>
            </div>

            {gpsPoints.length === 0 && zones.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-gray-500 text-sm">
                    <p>Aucune donnée GPS pour aujourd'hui</p>
                </div>
            ) : (
                <div
                    ref={mapRef}
                    className="h-80 w-full"
                    style={{ background: '#0d1117' }}
                />
            )}
        </div>
    );
}
