package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewPostDTO {

    private String text;
    private MultipartFile file;
    private double rating;
    private Long shopId;
    private Long productId;
}
