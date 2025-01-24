package com.example.backend.controller;

import com.example.backend.dto.LocationInfo;
import com.example.backend.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class LocationController {

    @Autowired
    LocationService locationService;

    @PostMapping("/user/updateLocation")
    public ResponseEntity<Map<String, Object>> updateLocation(@RequestBody LocationInfo locationInfo, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return locationService.updateLocation(locationInfo, authHeader.substring(7));
    }
}
