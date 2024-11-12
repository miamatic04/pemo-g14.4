package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShopDistance {

    private Long Id;
    private String shopName;
    private double distance;

    public ShopDistance(Shop shop, double distance) {
        this.shopName = shop.getShopName();
        this.Id = shop.getId();
        this.distance = distance;
    }
}
