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
public class ShopProfileDTO {

    private String shopName;
    private String description;
    private String imagePath;
    private List<ReviewDTO> reviews;
    private List<ProductInfoDTO> products;
}
