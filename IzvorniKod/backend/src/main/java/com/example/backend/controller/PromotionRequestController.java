package com.example.backend.controller;

import com.example.backend.model.PromotionRequestDTO;
import com.example.backend.model.UserDTO;
import com.example.backend.service.PromotionRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class PromotionRequestController {

    @Autowired
    private PromotionRequestService promotionRequestService;

    @GetMapping("/getPromotionRequests")
    public ResponseEntity<List<PromotionRequestDTO>> getAllRequests() {
        return ResponseEntity.ok(promotionRequestService.getAllRequests());
    }

    @PostMapping("/promoteUser")
    public ResponseEntity<String> getAllRequests(@RequestBody UserDTO userDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(promotionRequestService.promoteToOwner(userDTO.getEmail(), authHeader.substring(7)));
    }

    @PostMapping("/requestPromotion")
    public ResponseEntity<Map<String, Object>> getAllRequests(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(promotionRequestService.requestPromotion(authHeader.substring(7)));
    }
}
