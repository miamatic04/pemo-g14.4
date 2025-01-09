package com.example.backend.controller;

import com.example.backend.model.ProductProfileDTO;
import com.example.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductProfileDTO> getProductProfile(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductProfile(id));
    }
}
