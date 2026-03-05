import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
    latitude: string;
    longitude: string;
    radius: number;
    onLocationChange: (lat: string, lng: string, address?: string) => void;
}

interface SearchResult {
    display_name: string;
    lat: string;
    lon: string;
}

/**
 * Composant de sélection d'emplacement sur carte.
 * - Clic sur la carte pour sélectionner un point
 * - Recherche d'adresse via Nominatim (OpenStreetMap)
 * - Affichage du rayon de détection
 */
export default function LocationPicker({ latitude, longitude, radius, onLocationChange }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapObj = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const circleRef = useRef<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [noResults, setNoResults] = useState(false);

    // Initialiser la carte
    useEffect(() => {
        if (!mapRef.current || mapObj.current) return;

        import('leaflet').then((L) => {
            // Fix icônes Leaflet avec Vite
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            });

            // Centre par défaut : Abidjan ou coordonnées fournies
            const lat = latitude ? parseFloat(latitude) : 5.3364;
            const lng = longitude ? parseFloat(longitude) : -4.0267;

            const map = L.map(mapRef.current!, {
                center: [lat, lng],
                zoom: 15,
                zoomControl: true,
            });

            mapObj.current = map;

            // Tuiles OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
                maxZoom: 19,
            }).addTo(map);

            // Marqueur initial si coordonnées fournies
            if (latitude && longitude) {
                markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
                circleRef.current = L.circle([lat, lng], {
                    radius: radius || 200,
                    color: '#10b981',
                    fillColor: '#10b981',
                    fillOpacity: 0.15,
                    weight: 2,
                }).addTo(map);

                // Drag du marqueur
                markerRef.current.on('dragend', () => {
                    const pos = markerRef.current.getLatLng();
                    onLocationChange(pos.lat.toFixed(8), pos.lng.toFixed(8));
                });
            }

            // Clic sur la carte pour placer/déplacer le marqueur
            map.on('click', (e: any) => {
                const { lat, lng } = e.latlng;

                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                    circleRef.current?.setLatLng([lat, lng]);
                } else {
                    markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
                    circleRef.current = L.circle([lat, lng], {
                        radius: radius || 200,
                        color: '#10b981',
                        fillColor: '#10b981',
                        fillOpacity: 0.15,
                        weight: 2,
                    }).addTo(map);

                    markerRef.current.on('dragend', () => {
                        const pos = markerRef.current.getLatLng();
                        onLocationChange(pos.lat.toFixed(8), pos.lng.toFixed(8));
                    });
                }

                onLocationChange(lat.toFixed(8), lng.toFixed(8));
                reverseGeocode(lat, lng);
            });
        });

        return () => {
            if (mapObj.current) {
                mapObj.current.remove();
                mapObj.current = null;
            }
        };
    }, []);

    // Mettre à jour le rayon quand il change
    useEffect(() => {
        if (circleRef.current && radius) {
            circleRef.current.setRadius(radius);
        }
    }, [radius]);

    // Mettre à jour la position du marqueur quand les coordonnées changent de l'extérieur
    useEffect(() => {
        if (!mapObj.current || !latitude || !longitude) return;

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lng)) return;

        import('leaflet').then((L) => {
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
                circleRef.current?.setLatLng([lat, lng]);
            } else {
                markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapObj.current);
                circleRef.current = L.circle([lat, lng], {
                    radius: radius || 200,
                    color: '#10b981',
                    fillColor: '#10b981',
                    fillOpacity: 0.15,
                    weight: 2,
                }).addTo(mapObj.current);

                markerRef.current.on('dragend', () => {
                    const pos = markerRef.current.getLatLng();
                    onLocationChange(pos.lat.toFixed(8), pos.lng.toFixed(8));
                });
            }

            mapObj.current.setView([lat, lng], mapObj.current.getZoom());
        });
    }, [latitude, longitude]);

    // Recherche d'adresse via Nominatim
    const searchAddress = useCallback(async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchResults([]);
        setNoResults(false);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`,
                {
                    method: 'GET',
                    signal: controller.signal,
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('Résultats recherche:', data);
            setSearchResults(data);
            setShowResults(data.length > 0);
            setNoResults(data.length === 0);
        } catch (error) {
            console.error('Erreur de recherche:', error);
            setSearchResults([]);
            setNoResults(true);
        } finally {
            setIsSearching(false);
        }
    }, [searchQuery]);

    // Géocodage inverse pour obtenir l'adresse
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            if (!response.ok) return;
            const data = await response.json();
            if (data.display_name) {
                onLocationChange(lat.toFixed(8), lng.toFixed(8), data.display_name);
            }
        } catch (error) {
            console.error('Erreur de géocodage inverse:', error);
        }
    };

    // Sélectionner un résultat de recherche
    const selectResult = (result: SearchResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        onLocationChange(result.lat, result.lon, result.display_name);
        setShowResults(false);
        setSearchQuery(result.display_name.split(',')[0]);

        if (mapObj.current) {
            mapObj.current.setView([lat, lng], 16);
        }
    };

    return (
        <div className="space-y-3">
            {/* Barre de recherche */}
            <div className="relative">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowResults(false);
                            setNoResults(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                e.stopPropagation();
                                searchAddress();
                            }
                        }}
                        placeholder="Rechercher une adresse (ex: Plateau Abidjan)..."
                        className="flex-1 rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                        type="button"
                        onClick={searchAddress}
                        disabled={isSearching || !searchQuery.trim()}
                        className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50"
                    >
                        {isSearching ? '...' : '🔍'}
                    </button>
                </div>

                {/* Résultats de recherche */}
                {showResults && searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 z-[9999] mt-1 w-full rounded-lg border border-white/10 bg-[#1a2332] shadow-xl max-h-60 overflow-y-auto">
                        {searchResults.map((result, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => selectResult(result)}
                                className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg border-b border-white/5 last:border-0"
                            >
                                📍 {result.display_name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Aucun résultat */}
                {noResults && !isSearching && (
                    <div className="absolute left-0 right-0 z-[9999] mt-1 w-full rounded-lg border border-white/10 bg-[#1a2332] px-3 py-2 text-sm text-gray-500">
                        Aucun résultat trouvé. Essayez un autre terme.
                    </div>
                )}
            </div>

            {/* Carte */}
            <div
                ref={mapRef}
                className="h-[300px] w-full rounded-lg border border-white/10 overflow-hidden"
                style={{ background: '#1a2332' }}
            />

            {/* Instructions */}
            <p className="text-xs text-gray-500">
                💡 Cliquez sur la carte pour placer le marqueur, ou recherchez une adresse ci-dessus. Vous pouvez aussi glisser le marqueur.
            </p>
        </div>
    );
}
