package com.example.backend.controller;

import com.example.backend.dto.AddProductDTO;
import com.example.backend.dto.PlatformProductDTO;
import com.example.backend.dto.ProductInfoDTO;
import com.example.backend.dto.ProductProfileDTO;
import com.example.backend.service.ProductService;
import com.example.backend.utils.Recommend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private Recommend recommend;

    @GetMapping("/getProduct/{id}")
    public ResponseEntity<ProductProfileDTO> getProductProfile(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(productService.getProductProfile(id, authHeader.substring(7)));
    }

    @GetMapping("/hood/getProducts")
    public ResponseEntity<List<ProductInfoDTO>> getHoodProducts(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        List<ProductInfoDTO> products = productService.getHoodProducts(authHeader.substring(7));
        return ResponseEntity.ok(products);
    }

    @GetMapping("/home/getRecommendedProducts")
    public ResponseEntity<List<ProductInfoDTO>> getRecommendedProducts(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        List<ProductInfoDTO> products = productService.getRecommendedProducts(authHeader.substring(7));
        return ResponseEntity.ok(products);
    }

    @GetMapping("/getAllProducts")
    public ResponseEntity<List<ProductInfoDTO>> getAllProducts(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        List<ProductInfoDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping("/addProduct")
    public ResponseEntity<String> addProduct(@RequestBody AddProductDTO addProductDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(productService.addProduct(addProductDTO, authHeader.substring(7)));
    }

    @PostMapping("/addProductToPlatform")
    public ResponseEntity<String> addProductToPlatform(@ModelAttribute PlatformProductDTO platformProductDTO, @RequestParam(value = "file", required = false) MultipartFile file, @RequestHeader(value = "Authorization", required = false) String authHeader) throws IOException {
        return productService.addProductToPlatform(platformProductDTO, file,  authHeader.substring(7));
    }

    @GetMapping("/getPlatformProducts")
    public ResponseEntity<List<PlatformProductDTO>> getPlatformProducts() {
        return ResponseEntity.ok(productService.getPlatformProducts());
    }

    @PostMapping("/editProduct")
    public ResponseEntity<String> editProduct(@RequestBody AddProductDTO editProductDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(productService.editProduct(editProductDTO, authHeader.substring(7)));
    }
}
