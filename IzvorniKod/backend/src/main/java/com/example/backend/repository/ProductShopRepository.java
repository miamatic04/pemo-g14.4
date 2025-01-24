package com.example.backend.repository;

import com.example.backend.model.ProductShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductShopRepository extends JpaRepository<ProductShop, Long> {
    List<ProductShop> findByShopId(Long shopId);

    @Query("SELECT ps FROM ProductShop ps " +
            "JOIN ps.product p " +
            "WHERE p.category IN :categories")
    List<ProductShop> findProductShopsByCategories(@Param("categories") List<String> categories);
}
