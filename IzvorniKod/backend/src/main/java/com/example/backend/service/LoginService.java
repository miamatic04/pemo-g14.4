package com.example.backend.service;

import com.example.backend.exception.EmailNotConfirmedException;
import com.example.backend.exception.InvalidLoginException;
import com.example.backend.model.LoginInfo;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PersonService personService;

    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginInfo loginInfo) throws JsonProcessingException {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginInfo.getEmail(), loginInfo.getPass()));

        if(authentication.isAuthenticated()) {

            if(personService.findUser(loginInfo.getEmail()).getEmailConfirmed()) {
                Map<String, Object> response = new HashMap<>();
                response.put("token", jwtService.generateToken(loginInfo.getEmail()));
                response.put("role", authentication.getAuthorities().toString());

                return ResponseEntity.ok(response);
            } else
                throw new EmailNotConfirmedException("Email not confirmed.");

        }

        throw new InvalidLoginException("Invalid login credentials.");
    }
}
