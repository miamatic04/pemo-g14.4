package com.example.backend.model;

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

    private String name;
    private String description;
    private String category;
    private double price;
    private String imagePath;
    private double distance;
    private List<ReviewDTO> reviews;
}
