package com.example.backend.controller;

import com.example.backend.dto.ShopInfoDTO;
import com.example.backend.service.JWTService;
import com.example.backend.service.OwnerService;
import com.example.backend.service.PersonService;
import com.example.backend.service.ShopService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OwnerController {

    @Autowired
    private PersonService personService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private ShopService shopService;

    @Autowired
    private OwnerService ownerService;

    @GetMapping("/owner/getMyShops")
    public ResponseEntity<List<ShopInfoDTO>> getMyShops(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ownerService.getMyShops(authHeader);
    }

    @DeleteMapping("/owner/deleteShop")
    @Transactional
    public ResponseEntity<Void> deleteShop(@RequestParam("id") int id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ownerService.deleteShop(id, authHeader);
    }
}
