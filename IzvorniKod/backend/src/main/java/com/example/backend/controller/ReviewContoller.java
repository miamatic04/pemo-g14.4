package com.example.backend.controller;

import com.example.backend.dto.ReviewPostDTO;
import com.example.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ReviewContoller {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/postReview")
    public ResponseEntity<String> postReview(@ModelAttribute ReviewPostDTO reviewPostDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(reviewService.postReview(reviewPostDTO, authHeader.substring(7)));
    }
}
