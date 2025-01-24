package com.example.backend.repository;

import com.example.backend.model.Product;
import com.example.backend.model.ProductShop;
import com.example.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByShopId(Long shopId);

    List<Review> findByProductShop(ProductShop product);
}
