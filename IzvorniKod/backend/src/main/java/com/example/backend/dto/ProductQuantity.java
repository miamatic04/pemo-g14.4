package com.example.backend.dto;

import com.example.backend.dto.ProductInfoDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductQuantity {

    private ProductInfoDTO product;
    private int quantity;
}
