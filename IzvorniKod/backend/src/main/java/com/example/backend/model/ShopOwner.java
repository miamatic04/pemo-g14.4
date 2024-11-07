package com.example.backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@IdClass(compositeKeyEmailOIB.class)
public class ShopOwner extends Person {

    @Id
    private String OIB;

    // Relacija jedan-prema-više s entitetom Shop (jedan vlasnik moze biti vlasnik vise trgovina)
    @OneToMany(mappedBy = "shopOwner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Shop> shops;

    public ShopOwner() {

    }

    public String getOIB() {
        return OIB;
    }

    public void setOIB(String OIB) {
        this.OIB = OIB;
    }
}
