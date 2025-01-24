package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscountDTO {
    private String code;
    private double discount;
    private Long shopId;
    private String shopName;
}
