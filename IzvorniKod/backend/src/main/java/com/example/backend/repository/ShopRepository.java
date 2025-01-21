package com.example.backend.repository;

import com.example.backend.model.Shop;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

    // dohvati sve trgovine
    List<Shop> findAll();

    // sortiraj trgovine abecednim redoslijedom
    @Query("SELECT s FROM Shop s ORDER BY s.shopName ASC")
    List<Shop> findAllSortedByNameAsc();

    // sortiraj trgovine obrnutim abecednim redoslijedom
    @Query("SELECT s FROM Shop s ORDER BY s.shopName DESC")
    List<Shop> findAllSortedByNameDesc();

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM shop WHERE id = :id", nativeQuery = true)
    void deleteShopById(@Param("id") Long id);

    @Query("SELECT DISTINCT s FROM Shop s " +
            "JOIN s.products ps " +
            "JOIN ps.product p " +
            "WHERE p.category IN :categories")
    List<Shop> findShopsByProductCategories(@Param("categories") List<String> categories);

}
