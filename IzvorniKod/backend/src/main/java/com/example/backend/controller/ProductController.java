package com.example.backend.controller;

import com.example.backend.model.ProductInfoDTO;
import com.example.backend.model.ProductProfileDTO;
import com.example.backend.model.ProductShop;
import com.example.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/getProduct/{id}")
    public ResponseEntity<ProductProfileDTO> getProductProfile(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductProfile(id));
    }

    @GetMapping("/hood/getProducts/{radius}")
    public ResponseEntity<List<ProductInfoDTO>> getHoodProducts(@RequestHeader(value = "Authorization", required = false) String authHeader, @PathVariable double radius) {
        List<ProductInfoDTO> products = productService.getHoodProducts(authHeader.substring(7), radius);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/getAllProducts")
    public ResponseEntity<List<ProductInfoDTO>> getAllProducts(@RequestHeader(value = "Authorization", required = false) String authHeader, @PathVariable double radius) {
        List<ProductInfoDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
}
