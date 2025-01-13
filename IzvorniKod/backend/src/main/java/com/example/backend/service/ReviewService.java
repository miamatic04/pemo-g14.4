package com.example.backend.service;

import com.example.backend.exception.ProductNotFoundException;
import com.example.backend.exception.ShopNotFoundException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.PersonRepository;
import com.example.backend.repository.ProductShopRepository;
import com.example.backend.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private JWTService jwtService;
    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private ProductShopRepository productShopRepository;

    public String postReview(ReviewPostDTO reviewPostDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        Shop shop = null;
        ProductShop product = null;

        if(reviewPostDTO.getShopId() != null)
            shop = shopRepository.findById(reviewPostDTO.getShopId()).orElseThrow(() -> new ShopNotFoundException("Shop not found"));
        if(reviewPostDTO.getProductId() != null)
            product = productShopRepository.findById(reviewPostDTO.getProductId()).orElseThrow(() -> new ProductNotFoundException("Product not found"));

        Review review = new Review();
        review.setAuthor(user);
        if(shop != null)
            review.setShop(shop);
        if(product != null)
            review.setProductShop(product);
        review.setText(reviewPostDTO.getText());
        review.setRating(reviewPostDTO.getRating());

        if(product != null) {
            product.getReviews().add(review);
            productShopRepository.save(product);
        } else if (shop != null) {
            shop.getReviews().add(review);
            shopRepository.save(shop);
        }

        return "Review added successfully";
    }
}
