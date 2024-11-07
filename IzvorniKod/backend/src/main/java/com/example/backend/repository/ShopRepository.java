package com.example.backend.repository;

import com.example.backend.model.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

    // dohvati sve trgovine
    List<Shop> findAll();

    // sortiraj trgovine abecednim redoslijedom
    @Query("SELECT shopName, id FROM Shop  ORDER BY shopName ASC")
    List<Shop> findAllSortedByNameAsc();

    // sortiraj trgovine obrnutim abecednim redoslijedom
    @Query("SELECT shopName, id FROM Shop  ORDER BY shopName DESC")
    List<Shop> findAllSortedByNameDesc();


}