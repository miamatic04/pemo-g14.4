package com.example.backend.service;

import com.example.backend.model.ShopOwner;
import com.example.backend.repository.ShopOwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShopOwnerService {

    @Autowired
    private ShopOwnerRepository shopOwnerRepository;

    public ShopOwner findShopOwner(String email) {
        return shopOwnerRepository.findByEmail(email);
    }
}
