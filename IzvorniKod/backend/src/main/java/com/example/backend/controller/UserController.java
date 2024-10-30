package com.example.backend.controller;

import com.example.backend.model.ShopUser;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;


    @PostMapping("/register/addUser")
    public ResponseEntity<Map<String, Object>> addUser(@RequestBody ShopUser shopUser) {

        Map<String, Object> response = new HashMap<>();

        if(userService.findUser(shopUser.getEmail()) != null) {
            response.put("message", "Email address already in use.");
            response.put("code", 0);
        } else if(!shopUser.getPass().equals(shopUser.getPassConfirm())) {
            response.put("message", "Passwords don't match.");
            response.put("code", 1);
        } else {
            response.put("message", "Account successfully created");
            response.put("code", 2);
            userService.saveUser(shopUser);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody ShopUser shopUser) {
        Map<String, Object> response = new HashMap<>();
        if(userService.findUser(shopUser.getEmail()) != null) {
            if(userService.findUser(shopUser.getEmail()).getPass().equals(shopUser.getPass())) {
                response.put("message", "Login successful");
                response.put("code", 0);
                return ResponseEntity.ok(response);
            }
        }

        response.put("message", "Login failed");
        response.put("code", 1);

        return ResponseEntity.ok(response);

    }
}
