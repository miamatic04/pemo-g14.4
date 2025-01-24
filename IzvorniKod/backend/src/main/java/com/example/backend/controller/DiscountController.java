package com.example.backend.controller;

import com.example.backend.dto.DiscountDTO;
import com.example.backend.service.DiscountService;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
public class DiscountController {

    private final DiscountService discountService;

    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    @PostMapping("/addDiscount")
    public ResponseEntity<String> addDiscount(@RequestBody DiscountDTO discountDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(discountService.addDiscount(discountDTO, authHeader.substring(7)));
    }

    @PostMapping("/applyDiscount")
    public ResponseEntity<Map<String, Object>> applyDiscount(@RequestBody DiscountDTO discountDTO) {
        return ResponseEntity.ok(discountService.applyDiscount(discountDTO));
    }

    @GetMapping("/getShopDiscounts/{shopId}")
    public ResponseEntity<List<DiscountDTO>> getShopDiscounts(@PathVariable Long shopId) {
        return ResponseEntity.ok(discountService.getDiscounts(shopId));
    }

    @GetMapping("/getAllDiscounts")
    public ResponseEntity<List<DiscountDTO>> getAllDiscounts() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }

    @GetMapping("/getHoodDiscounts")
    public ResponseEntity<List<DiscountDTO>> getShopDiscounts(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(discountService.getHoodDiscounts(authHeader.substring(7)));
    }
}
