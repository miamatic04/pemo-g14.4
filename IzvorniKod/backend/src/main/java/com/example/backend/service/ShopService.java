package com.example.backend.service;

import com.example.backend.repository.ShopRepository;
import com.example.backend.repository.ShopUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    
}
