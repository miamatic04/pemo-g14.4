package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    @Min(0)
    @Max(5)
    private double rating;
    private String imagePath;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private ProductShop productShop;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    @JsonBackReference
    private Shop shop;

    @OneToOne(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private Reply reply;

    @ManyToOne
    @JoinColumn(name = "author_id")
    @JsonBackReference
    private Person author;

    @OneToMany(mappedBy = "reportedReview", cascade = CascadeType.ALL)
    private List<Report> incomingReports = new ArrayList<>();
}
