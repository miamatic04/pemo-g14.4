package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddProductDTO {

    private Long id; //if id != null, existing product is being edited, not a new one being added
    private Long productId;
    private Long shopId;
    private String description;
    private double price;
    private String imagePath;
}
