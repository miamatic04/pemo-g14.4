package com.example.backend.controller;

import ch.qos.logback.core.model.Model;
import com.example.backend.exception.InvalidLoginException;
import com.example.backend.model.LoginInfo;
import com.example.backend.service.LoginService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpSession;
import org.apache.catalina.Authenticator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

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
