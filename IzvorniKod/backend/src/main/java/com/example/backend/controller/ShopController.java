package com.example.backend.controller;

import com.example.backend.model.Shop;
import com.example.backend.model.ShopDistance;
import com.example.backend.model.ShopUser;
import com.example.backend.service.JWTService;
import com.example.backend.service.ShopService;
import com.example.backend.service.ShopUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping("/home/getShopsAZ")
    public ResponseEntity<List<ShopDistance>> getShopsAZ(@RequestHeader(value = "Authorization", required = false) String authHeader) {

        String token = authHeader.substring(7);

        return shopService.getShopsSortedByNameAsc(token);
    }

    @GetMapping("/home/getShopsZA")
    public ResponseEntity<List<ShopDistance>> getShopsZA(@RequestHeader(value = "Authorization", required = false) String authHeader) {

        String token = authHeader.substring(7);

        return shopService.getShopsSortedByNameDesc(token);
    }

    @GetMapping("/home/getShopsByDistanceAsc")
    public ResponseEntity<List<ShopDistance>> getShopsByDistanceAsc(@RequestHeader(value = "Authorization", required = false) String authHeader) {

        String token = authHeader.substring(7);

        return shopService.getShopsSortedByDistanceAsc(token);
    }
}
