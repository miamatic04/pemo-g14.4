package com.example.backend.controller;

import com.example.backend.model.Person;
import com.example.backend.model.RegistrationInfo;
import com.example.backend.service.JWTService;
import com.example.backend.service.ShopService;
import com.example.backend.service.PersonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private PersonService personService;

    @Autowired
    JWTService jwtService;

    @PostMapping("/register/addUser")
    public ResponseEntity<Map<String, Object>> addUser(@RequestBody RegistrationInfo registrationInfo) {
        return personService.addUser(registrationInfo);
    }

    @GetMapping("/userhome/getUserInfo")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestHeader(value = "Authorization", required = false) String authHeader, @AuthenticationPrincipal OAuth2User oauth2User) {

        String email = jwtService.extractUsername(authHeader.substring(7));

        return ResponseEntity.ok(Map.of("email", email));
    }

}
