package com.example.backend.controller;

import com.example.backend.model.ReviewPostDTO;
import com.example.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReviewContoller {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/postReview")
    public ResponseEntity<String> postReview(@RequestBody ReviewPostDTO reviewPostDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(reviewService.postReview(reviewPostDTO, authHeader.substring(7)));
    }
}
