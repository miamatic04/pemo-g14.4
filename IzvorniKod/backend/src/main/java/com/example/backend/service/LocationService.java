package com.example.backend.service;

import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.LocationInfo;
import com.example.backend.model.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LocationService {

    @Autowired
    private PersonService personService;

    @Autowired
    JWTService jwtService;

    public ResponseEntity<Map<String, Object>> updateLocation(LocationInfo locationInfo, String token) {

        String email = jwtService.extractUsername(token);

        Person user = personService.findUser(email);

        if(user != null) {
            user.setLongitude(locationInfo.getLongitude());
            user.setLatitude(locationInfo.getLatitude());
            personService.save(user);
            return ResponseEntity.ok(Map.of("message", "Location successfully updated."));
        } else
            throw new UserNotFoundException("User not found.");
    }

}
