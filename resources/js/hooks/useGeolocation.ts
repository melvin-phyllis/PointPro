import { useCallback, useState } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    loading: boolean;
    error: string | null;
}

/**
 * Hook : capture la position GPS de l'utilisateur.
 */
export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        latitude:  null,
        longitude: null,
        accuracy:  null,
        loading:   false,
        error:     null,
    });

    const getPosition = useCallback((): Promise<GeolocationCoordinates> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const err = 'La géolocalisation n\'est pas supportée par votre navigateur.';
                setState(s => ({ ...s, error: err, loading: false }));
                reject(new Error(err));
                return;
            }

            setState(s => ({ ...s, loading: true, error: null }));

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setState({
                        latitude:  position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy:  position.coords.accuracy,
                        loading:   false,
                        error:     null,
                    });
                    resolve(position.coords);
                },
                (err) => {
                    let message = 'Impossible de récupérer votre position.';
                    switch (err.code) {
                        case err.PERMISSION_DENIED:
                            message = 'Accès à la géolocalisation refusé. Veuillez autoriser l\'accès dans votre navigateur.';
                            break;
                        case err.POSITION_UNAVAILABLE:
                            message = 'Position non disponible. Vérifiez votre connexion GPS.';
                            break;
                        case err.TIMEOUT:
                            message = 'Délai de géolocalisation dépassé. Réessayez.';
                            break;
                    }
                    setState(s => ({ ...s, loading: false, error: message }));
                    reject(new Error(message));
                },
                {
                    enableHighAccuracy: true,
                    timeout:            10000,
                    maximumAge:         0,
                }
            );
        });
    }, []);

    return { ...state, getPosition };
}
