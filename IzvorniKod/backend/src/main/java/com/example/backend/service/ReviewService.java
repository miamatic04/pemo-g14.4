package com.example.backend.service;

import com.example.backend.exception.ProductNotFoundException;
import com.example.backend.exception.ShopNotFoundException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.PersonRepository;
import com.example.backend.repository.ProductShopRepository;
import com.example.backend.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

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

    @Value("${spring.boot.web.url.img}")
    private String web_url_img;

    public String postReview(ReviewPostDTO reviewPostDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        String frontendPath = null;

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        if(reviewPostDTO.getFile() != null) {
            String folderPath = "public/userUploads/";

            try {

                File directory = new File(folderPath);
                if (!directory.exists()) {
                    directory.mkdirs();
                }

                String emailNoPeriods = email.replaceAll("\\.", "");

                int index = 0;
                List<Review> reviews = user.getReviews();

                for (Review review : reviews) {
                    String imagePath = review.getImagePath();
                    if (imagePath != null && imagePath.contains(".")) {
                        String[] parts = imagePath.split("\\.");
                        if (parts.length > 1) {
                            try {
                                int currentIndex = Integer.parseInt(parts[0].substring(parts[0].length() - 1));
                                index = Math.max(index, currentIndex);
                            } catch (NumberFormatException e) {
                                System.out.println("Invalid image index format in path: " + imagePath);
                            }
                        }
                    }
                }

                index++;

                String originalFilename = StringUtils.cleanPath(reviewPostDTO.getFile().getOriginalFilename());
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String newFilename = emailNoPeriods + "_review" + index + extension; // e.g. asd@gmailcom_review0.png

                Path targetLocation = Paths.get(folderPath + newFilename);

                if (Files.exists(targetLocation)) {
                    try {
                        Files.delete(targetLocation);
                    } catch (IOException e) {
                        System.out.println("Error deleting existing file: " + e.getMessage());
                        return "Error deleting existing file";
                    }
                }

                Files.copy(reviewPostDTO.getFile().getInputStream(), targetLocation);

                frontendPath = "http://" + web_url_img + "/userUploads/" + newFilename;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
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
        review.setImagePath(frontendPath);

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
