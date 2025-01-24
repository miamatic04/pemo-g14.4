package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private List<ProductQuantity> orderProducts;
    private double total;
    private boolean paid;
    private boolean cancelled;
    private boolean active;
    private LocalDate orderDate;
}
