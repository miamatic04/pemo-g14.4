package com.example.backend.controller;

import com.example.backend.dto.AddShopDTO;
import com.example.backend.dto.ShopProfileDTO;
import com.example.backend.dto.ShopDistance;
import com.example.backend.service.JWTService;
import com.example.backend.service.PersonService;
import com.example.backend.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/home/getRecommendedShopsAZ")
    public ResponseEntity<List<ShopDistance>> getRecommendedShopsAZ(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return shopService.getRecommendedShopsSortedByNameAsc(authHeader);
    }

    @GetMapping("/home/getRecommendedShopsZA")
    public ResponseEntity<List<ShopDistance>> getRecommendedShopsZA(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return shopService.getRecommendedShopsSortedByNameDesc(authHeader);
    }

    @GetMapping("/home/getRecommendedShopsByDistanceAsc")
    public ResponseEntity<List<ShopDistance>> getRecommendedShopsByDistanceAsc(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return shopService.getRecommendedShopsSortedByDistanceAsc(authHeader);
    }

    @PostMapping("/addShop")
    public ResponseEntity<Map<String, Object>> addShop(@ModelAttribute AddShopDTO addShopDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return shopService.addShop(addShopDTO, authHeader);
    }

    @PostMapping("/editShop")
    public ResponseEntity<String> editShop(@ModelAttribute AddShopDTO editShopDTO) {
        return ResponseEntity.ok(shopService.editShop(editShopDTO));
    }

    @GetMapping("/shops/{shopId}")
    public ResponseEntity<ShopProfileDTO> getShopDetails(@PathVariable Long shopId, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        ShopProfileDTO shopDetails = shopService.getShopProfileDetails(shopId, authHeader.substring(7));
        return ResponseEntity.ok(shopDetails);
    }

    @GetMapping("/hood/getShops")
    public ResponseEntity<List<ShopDistance>> getHoodShops(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(shopService.getHoodShops(authHeader.substring(7)));
    }
}
