package com.example.backend.controller;

import com.example.backend.exception.InvalidRoleException;
import com.example.backend.model.Person;
import com.example.backend.service.JWTService;
import com.example.backend.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TokenValidationController {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PersonService personService;

    @GetMapping("/validateToken")
    public ResponseEntity<Void> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/checkOwnerRole")
    public ResponseEntity<Void> checkOwnerRole(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String email = jwtService.extractUsername(authHeader.substring(7));

        Person user = personService.findUser(email);
        if(user.getRole().equals("owner")) {
            return ResponseEntity.ok().build();
        }

        throw new InvalidRoleException("Invalid role exception: not an owner.");
    }
}
