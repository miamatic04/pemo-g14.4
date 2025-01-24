package com.example.backend.controller;

import com.example.backend.exception.InvalidLoginException;
import com.example.backend.dto.LoginInfo;
import com.example.backend.service.LoginService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginInfo loginInfo) throws JsonProcessingException {
        return loginService.login(loginInfo);
    }

    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> loginFailed(@RequestBody LoginInfo loginInfo) {
        throw new InvalidLoginException("Invalid login credentials");
    }


}
