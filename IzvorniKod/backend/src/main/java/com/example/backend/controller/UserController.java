package com.example.backend.controller;

import com.example.backend.model.LoginInfo;
import com.example.backend.model.Shop;
import com.example.backend.model.ShopUser;
import com.example.backend.service.LoginService;
import com.example.backend.service.ShopService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private ShopService shopService;



    @PostMapping("/register/addUser")
    public ResponseEntity<Map<String, Object>> addUser(@RequestBody ShopUser shopUser) {

        return userService.addUser(shopUser);
    }

    @GetMapping("/home")
    public ResponseEntity<List<Shop>> home() {
        List<Shop> shops = shopService.findAll();
        System.out.println(shops.get(0).getShopName());
        return ResponseEntity.ok(shops);
    }
}
