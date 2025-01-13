package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductInfoDTO {

    private Long id;
    private String name;
    private String description;
    private double price;
    private String imagePath;
    private double distance;

    public ProductInfoDTO(ProductShop productShop) {
        this.id = productShop.getId();
        this.name = productShop.getProduct().getName();
        this.description = productShop.getDescription();
        this.price = productShop.getPrice();
        this.imagePath = productShop.getImagePath();
        this.distance = -1;
    }
}
