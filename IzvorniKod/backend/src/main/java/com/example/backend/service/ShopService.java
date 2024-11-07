package com.example.backend.service;

import com.example.backend.model.Shop;
import com.example.backend.repository.ShopRepository;
import com.example.backend.repository.ShopUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    public List<Shop> findAll() {
        return shopRepository.findAll();
    }

    public List<Shop> getShopsSortedByNameAsc() {
        return shopRepository.findAllSortedByNameAsc();
    }

    public List<Shop> getShopsSortedByNameDesc() {
        return shopRepository.findAllSortedByNameDesc();
    }
}
