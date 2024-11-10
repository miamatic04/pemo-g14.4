package com.example.backend.controller;

import com.example.backend.model.Shop;
import com.example.backend.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping("/home/getShopsAZ")
    public ResponseEntity<List<Shop>> getShopsAZ() {
        List<Shop> shops = shopService.getShopsSortedByNameAsc();
        return ResponseEntity.ok(shops);
    }

    @GetMapping("/home/getShopsZA")
    public ResponseEntity<List<Shop>> getShopsZA() {
        List<Shop> shops = shopService.getShopsSortedByNameDesc();
        return ResponseEntity.ok(shops);
    }
}
