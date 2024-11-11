package com.example.backend.controller;

import com.example.backend.exception.TokenNotValidException;
import com.example.backend.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class TokenValidationController {

    @Autowired
    private JWTService jwtService;

    @GetMapping("/validateToken")
    public ResponseEntity<Void> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        System.out.println("HEADER: " + authHeader);
        System.out.println("EMAIL: " + jwtService.extractUsername(authHeader.substring(7)));
        return ResponseEntity.ok().build();
    }
}
