package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.service.JWTService;
import com.example.backend.service.PersonService;
import com.example.backend.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
public class ShopController {

    @Autowired
    private ShopService shopService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PersonService personService;

    @GetMapping("/home/getShopsAZ")
    public ResponseEntity<List<ShopDistance>> getShopsAZ(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return shopService.getShopsSortedByNameAsc(authHeader);
    }

    @GetMapping("/home/getShopsZA")
    public ResponseEntity<List<ShopDistance>> getShopsZA(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return shopService.getShopsSortedByNameDesc(authHeader);
    }

    @GetMapping("/home/getShopsByDistanceAsc")
    public ResponseEntity<List<ShopDistance>> getShopsByDistanceAsc(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return shopService.getShopsSortedByDistanceAsc(authHeader);
    }

    @PostMapping("/addShop")
    public ResponseEntity<Map<String, Object>> addShop(@ModelAttribute AddShopDTO addShopDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return shopService.addShop(addShopDTO, authHeader);
    }

    @PostMapping("/editShop")
    public ResponseEntity<String> editShop(@RequestBody AddShopDTO editShopDTO) {
        return ResponseEntity.ok(shopService.editShop(editShopDTO));
    }

    @GetMapping("/shops/{shopId}")
    public ResponseEntity<ShopProfileDTO> getShopDetails(@PathVariable Long shopId) {
        ShopProfileDTO shopDetails = shopService.getShopProfileDetails(shopId);
        return ResponseEntity.ok(shopDetails);
    }

    @GetMapping("/hood/getShops/{radius}")
    public ResponseEntity<List<ShopDistance>> getHoodShops(@RequestHeader(value = "Authorization", required = false) String authHeader, @PathVariable double radius) {
        return ResponseEntity.ok(shopService.getHoodShops(authHeader.substring(7), radius));
    }
}
