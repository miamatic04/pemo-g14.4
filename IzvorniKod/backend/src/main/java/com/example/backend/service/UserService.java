package com.example.backend.service;

import com.example.backend.model.ShopUser;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public ShopUser findUser(String email) {
        return userRepository.findByEmail(email);
    }

    public ShopUser saveUser(ShopUser shopUser) {
        return userRepository.save(shopUser);
    }
}
