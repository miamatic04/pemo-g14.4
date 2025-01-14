package com.example.backend.controller;

import com.example.backend.model.AddProductDTO;
import com.example.backend.model.ProductInfoDTO;
import com.example.backend.model.ProductProfileDTO;
import com.example.backend.model.ProductShop;
import com.example.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/getProduct/{id}")
    public ResponseEntity<ProductProfileDTO> getProductProfile(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(productService.getProductProfile(id, authHeader.substring(7)));
    }

    @GetMapping("/hood/getProducts/{radius}")
    public ResponseEntity<List<ProductInfoDTO>> getHoodProducts(@RequestHeader(value = "Authorization", required = false) String authHeader, @PathVariable double radius) {
        List<ProductInfoDTO> products = productService.getHoodProducts(authHeader.substring(7), radius);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/getAllProducts")
    public ResponseEntity<List<ProductInfoDTO>> getAllProducts(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        List<ProductInfoDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping("/addProduct")
    public ResponseEntity<String> addProduct(@RequestBody AddProductDTO addProductDTO) {
        return ResponseEntity.ok(productService.addProduct(addProductDTO));
    }

    @PostMapping("/editProduct")
    public ResponseEntity<String> editProduct(@RequestBody AddProductDTO editProductDTO) {
        return ResponseEntity.ok(productService.editProduct(editProductDTO));
    }
}
