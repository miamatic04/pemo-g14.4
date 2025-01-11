package com.example.backend.utils;

import org.springframework.stereotype.Service;

@Service
public class DistanceCalculator {

    // Haversina formula umjesto google distance matrix api
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {

        if(lat1 == 0 || lon1 == 0)
            return -1;

        double lat1Rad = Math.toRadians(lat1);
        double lon1Rad = Math.toRadians(lon1);
        double lat2Rad = Math.toRadians(lat2);
        double lon2Rad = Math.toRadians(lon2);

        double deltaLat = lat2Rad - lat1Rad;
        double deltaLon = lon2Rad - lon1Rad;

        double a = Math.pow(Math.sin(deltaLat / 2), 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.pow(Math.sin(deltaLon / 2), 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return 6371 * c; // u kilometrima
    }
}
