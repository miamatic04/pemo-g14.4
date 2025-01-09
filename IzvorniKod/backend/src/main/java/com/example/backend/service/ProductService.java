package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ProductShopRepository;
import com.example.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductShopRepository productShopRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public ProductProfileDTO getProductProfile(Long productId) {
        ProductShop product = productShopRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Fetching reviews related to the product
        List<Review> reviews = reviewRepository.findByProductShop(product);

        // Map the reviews to ReviewDTO
        List<ReviewDTO> reviewDTOs = reviews.stream()
                .map(review -> {
                    ReviewDTO reviewDTO = new ReviewDTO();
                    reviewDTO.setText(review.getText());
                    reviewDTO.setRating(review.getRating());
                    reviewDTO.setAuthor(review.getAuthor().getName());  // Assuming the review has an author (Person)
                    return reviewDTO;
                })
                .collect(Collectors.toList());

        // Map the product data to ProductDTO
        ProductProfileDTO productDTO = new ProductProfileDTO();
        productDTO.setName(product.getProduct().getName());
        productDTO.setDescription(product.getDescription());
        productDTO.setPrice(product.getPrice());
        productDTO.setImagePath(product.getImagePath());
        productDTO.setReviews(reviewDTOs);

        return productDTO;
    }
}
