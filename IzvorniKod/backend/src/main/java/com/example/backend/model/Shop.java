package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shopName;
    private double latitude;
    private double longitude;
    private String description;

    // Veza prema ShopOwneru (trgovina ima tocno jednog vlasnika)
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "owner_email", referencedColumnName = "email")
    })
    @JsonBackReference
    private Person shopOwner;

    @ManyToMany
    @JoinTable(
            name = "shop_product", // Name of the join table
            joinColumns = @JoinColumn(name = "shop_id"), // Foreign key for Shop
            inverseJoinColumns = @JoinColumn(name = "product_id") // Foreign key for Product
    )
    private Set<Product> products = new HashSet<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    private Set<Review> reviews = new HashSet<>();

    private String imagePath;

}
