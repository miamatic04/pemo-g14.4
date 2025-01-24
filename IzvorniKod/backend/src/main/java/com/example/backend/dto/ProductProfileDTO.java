package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductProfileDTO {
    private Long id;
    private String name;
    private int quantity;
    private String platformProduct;
    private String description;
    private String category;
    private double price;
    private String imagePath;
    private double distance;
    private List<ReviewDTO> reviews;
}
