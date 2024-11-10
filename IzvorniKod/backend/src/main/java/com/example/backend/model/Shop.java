package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    // Veza prema ShopOwneru (trgovina ima tocno jednog vlasnika)
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "owner_email", referencedColumnName = "email"),
            @JoinColumn(name = "owner_OIB", referencedColumnName = "OIB")
    })
    private ShopOwner shopOwner;


}
