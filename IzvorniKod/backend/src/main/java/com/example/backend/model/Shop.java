package com.example.backend.model;

import com.example.backend.enums.Hood;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
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

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ProductShop> products = new ArrayList<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "reportedShop", cascade = CascadeType.ALL)
    private List<Report> incomingReports = new ArrayList<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    private List<Event> events = new ArrayList<>();

    private String imagePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Hood hood;
}
