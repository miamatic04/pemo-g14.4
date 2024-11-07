package com.example.backend.service;

import com.example.backend.model.ShopUser;
import com.example.backend.repository.ShopUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private ShopUserRepository shopUserRepository;

    public ShopUser findUser(String email) {
        return shopUserRepository.findByEmail(email);
    }

    public ShopUser saveUser(ShopUser shopUser) {
        return shopUserRepository.save(shopUser);
    }

    public ResponseEntity<Map<String, Object>> addUser(ShopUser shopUser) {

        Map<String, Object> response = new HashMap<>();

        if(findUser(shopUser.getEmail()) != null) {
            response.put("message", "Email address already in use.");
        } else if(!shopUser.getPass().equals(shopUser.getPassConfirm())) {
            response.put("message", "Passwords don't match.");
        } else {
            response.put("message", "Account successfully created");
            saveUser(shopUser);
        }

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> login(ShopUser shopUser) {
        Map<String, Object> response = new HashMap<>();
        if(findUser(shopUser.getEmail()) != null) {
            if(findUser(shopUser.getEmail()).getPass().equals(shopUser.getPass())) {
                response.put("message", "Login successful");
                return ResponseEntity.ok(response);
            }
        }

        response.put("message", "Login failed");

        return ResponseEntity.ok(response);

    }
}
