package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "person_email", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderProduct> orderProducts;

    private double total;
    private boolean paid;
    private boolean cancelled;
    private LocalDate orderDate;

    public CustomerOrder(Person person, Shop shop) {
        this.person = person;
        this.shop = shop;
        this.orderProducts = new ArrayList<>();
        this.total = 0;
        this.paid = false;
        this.cancelled = false;
        this.orderDate = LocalDate.now();
    }
}
