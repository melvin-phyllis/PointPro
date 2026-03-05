<?php

namespace App\Services;

use App\Models\Location;

/**
 * Service de géolocalisation.
 * Gère le géofencing et les calculs de distance (formule de Haversine).
 */
class GeoService
{
    /**
     * Trouver la zone géographique la plus proche des coordonnées données.
     * Retourne null si aucune zone n'est dans le rayon autorisé.
     *
     * @param float $lat       Latitude du point à vérifier
     * @param float $lng       Longitude du point à vérifier
     * @param int   $companyId ID de l'entreprise
     */
    public function findNearestLocation(float $lat, float $lng, int $companyId): ?Location
    {
        // Récupérer toutes les zones actives de la company (sans le scope global)
        $locations = Location::withoutGlobalScope('company')
            ->where('company_id', $companyId)
            ->active()
            ->get();

        $nearestLocation = null;
        $minDistance     = PHP_INT_MAX;

        foreach ($locations as $location) {
            $distance = $this->calculateDistance($lat, $lng, $location->latitude, $location->longitude);

            // Vérifier si le point est dans le rayon ET si c'est le plus proche
            if ($distance <= $location->radius_meters && $distance < $minDistance) {
                $minDistance     = $distance;
                $nearestLocation = $location;
            }
        }

        return $nearestLocation;
    }

    /**
     * Calculer la distance en mètres entre deux points GPS.
     * Implémentation de la formule de Haversine.
     *
     * @param float $lat1 Latitude du point 1
     * @param float $lng1 Longitude du point 1
     * @param float $lat2 Latitude du point 2
     * @param float $lng2 Longitude du point 2
     * @return float Distance en mètres
     */
    public function calculateDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371000; // Rayon de la Terre en mètres

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Vérifier si un point est dans le rayon d'une zone géographique.
     *
     * @param float    $lat      Latitude à vérifier
     * @param float    $lng      Longitude à vérifier
     * @param Location $location Zone géographique
     */
    public function isWithinRadius(float $lat, float $lng, Location $location): bool
    {
        $distance = $this->calculateDistance($lat, $lng, $location->latitude, $location->longitude);
        return $distance <= $location->radius_meters;
    }
}
