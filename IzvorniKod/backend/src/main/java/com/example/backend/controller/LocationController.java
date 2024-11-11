package com.example.backend.controller;

import com.example.backend.model.LocationInfo;
import com.example.backend.model.LoginInfo;
import com.example.backend.service.LocationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class LocationController {

    @Autowired
    LocationService locationService;

    @PostMapping("/user/updateLocation")
    public ResponseEntity<Map<String, Object>> updateLocation(@RequestBody LocationInfo locationInfo, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return locationService.updateLocation(locationInfo, authHeader.substring(7));
    }
}
