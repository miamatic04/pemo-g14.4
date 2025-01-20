package com.example.backend.model;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopProfileDTO {

    private Long id;
    private String shopName;
    private String description;
    private String imagePath;
    private List<ReviewDTO> reviews;
    private List<ProductInfoDTO> products;
    private List<EventDTO> events;
    private boolean isShopOwner;

    public ShopProfileDTO(Shop shop, boolean isShopOwner) {
        this.id = shop.getId();
        this.shopName = shop.getShopName();
        this.description = shop.getDescription();
        this.imagePath = shop.getImagePath();

        List<ReviewDTO> reviewDTOs = new ArrayList<>();

        reviewDTOs = shop.getReviews()
                .stream()
                .map(review -> new ReviewDTO(review))
                .toList();

        this.reviews = reviewDTOs;

        List<ProductInfoDTO> productInfoDTOs = new ArrayList<>();

        productInfoDTOs = shop.getProducts()
                .stream()
                .map(product -> new ProductInfoDTO(product))
                .toList();

        this.products = productInfoDTOs;

        List<EventDTO> eventDTOs = new ArrayList<>();

        eventDTOs = shop.getEvents()
                .stream()
                .map(event -> new EventDTO(event, -1))
                .toList();

        this.events = eventDTOs;

        this.isShopOwner = isShopOwner;

    }
}
