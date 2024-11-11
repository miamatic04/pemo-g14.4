package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.service.JWTService;
import com.example.backend.service.ShopService;
import com.example.backend.service.ShopUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class UserController {

    @Autowired
    private ShopUserService shopUserService;
    @Autowired
    private ShopService shopService;

    @Autowired
    JWTService jwtService;



    @PostMapping("/register/addUser")
    public ResponseEntity<Map<String, Object>> addUser(@RequestBody ShopUser shopUser) {

        return shopUserService.addUser(shopUser);
    }

    @GetMapping("/userhome/getUserInfo")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestHeader(value = "Authorization", required = false) String authHeader, @AuthenticationPrincipal OAuth2User oauth2User) {

        String email = jwtService.extractUsername(authHeader.substring(7));

        return ResponseEntity.ok(Map.of("email", email));
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> updateUserLocation(LocationInfo locationInfo) {
        return shopUserService.updateUserLocation(locationInfo);
    }
}
