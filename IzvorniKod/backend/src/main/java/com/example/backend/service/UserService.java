package com.example.backend.service;

import com.example.backend.exception.EmailAlreadyInUseException;
import com.example.backend.exception.InvalidLoginException;
import com.example.backend.exception.PasswordsDontMatchException;
import com.example.backend.model.ShopUser;
import com.example.backend.repository.ShopUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {


    private final ShopUserRepository shopUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(ShopUserRepository shopUserRepository, PasswordEncoder passwordEncoder) {
        this.shopUserRepository = shopUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ShopUser findUser(String email) {
        return shopUserRepository.findByEmail(email);
    }

    public ShopUser saveUser(ShopUser shopUser) {
        return shopUserRepository.save(shopUser);
    }

    public ResponseEntity<Map<String, Object>> addUser(ShopUser shopUser) {

        Map<String, Object> response = new HashMap<>();

        if(findUser(shopUser.getEmail()) != null) {
            throw new EmailAlreadyInUseException("Email already in use");
        } else if(!shopUser.getPass().equals(shopUser.getPassConfirm())) {
            throw new PasswordsDontMatchException("Passwords don't match");
        } else {
            response.put("message", "Account successfully created");
            shopUser.setPass(passwordEncoder.encode(shopUser.getPass()));
            saveUser(shopUser);
        }

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> login(ShopUser shopUser) {

        Map<String, Object> response = new HashMap<>();

        ShopUser foundUser = findUser(shopUser.getEmail());
        if(foundUser != null) {
            if(passwordEncoder.matches(shopUser.getPass(), foundUser.getPass())) {
                response.put("message", "Login successful");
                return ResponseEntity.ok(response);
            }
        }

        throw new InvalidLoginException("Invalid login credentials");

    }
}
