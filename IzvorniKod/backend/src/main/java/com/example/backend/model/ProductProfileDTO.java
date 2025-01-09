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
    private double price;
    private String imagePath;
    private List<ReviewDTO> reviews;
}
