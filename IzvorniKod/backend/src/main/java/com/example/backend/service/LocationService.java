package com.example.backend.service;

import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.LocationInfo;
import com.example.backend.model.Shop;
import com.example.backend.model.ShopDistance;
import com.example.backend.model.ShopUser;
import com.example.backend.repository.ShopUserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LocationService {

    @Autowired
    private ShopUserService shopUserService;

    @Autowired
    JWTService jwtService;

    public ResponseEntity<Map<String, Object>> updateLocation(LocationInfo locationInfo, String token) {

        String email = jwtService.extractUsername(token);

        ShopUser user = shopUserService.findUser(email);

        if(user != null) {
            user.setLongitude(locationInfo.getLongitude());
            user.setLatitude(locationInfo.getLatitude());
            shopUserService.saveUser(user);
            return ResponseEntity.ok(Map.of("message", "Location successfully updated."));
        } else
            throw new UserNotFoundException("User not found.");
    }

}
