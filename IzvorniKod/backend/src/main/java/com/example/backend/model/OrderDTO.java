package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private Long shopId;
    private String shopName;
    private String imagePath;
    private Map<ProductInfoDTO, Integer> orderProducts;
    private double total;
    private boolean paid;
    private boolean cancelled;
    private LocalDate orderDate;
}
