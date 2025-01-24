package com.example.backend.dto;

import com.example.backend.model.ProductShop;
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
    private String shopName;
    private String description;
    private String category;
    private double price;
    private String imagePath;
    private double distance;
    private Long shopId;

    public ProductInfoDTO(ProductShop productShop) {
        this.shopId = productShop.getShop().getId();
        this.id = productShop.getId();
        this.name = productShop.getProduct().getName();
        this.shopName = productShop.getShop().getShopName();
        this.description = productShop.getDescription();
        this.category = productShop.getProduct().getCategory();
        this.price = productShop.getPrice();
        this.imagePath = productShop.getProduct().getImagePath();
        this.distance = -1;
    }
}
