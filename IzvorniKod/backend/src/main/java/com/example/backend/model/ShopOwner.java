package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@IdClass(compositeKeyEmailOIB.class)
public class ShopOwner extends Person {

    @Id
    private String OIB;

    // Relacija jedan-prema-više s entitetom Shop (jedan vlasnik moze biti vlasnik vise trgovina)
    @OneToMany(mappedBy = "shopOwner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Shop> shops;
}
