package com.example.backend.service;

import com.example.backend.model.ShopUser;
import com.example.backend.repository.ShopUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
