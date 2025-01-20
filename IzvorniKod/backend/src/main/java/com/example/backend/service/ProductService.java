package com.example.backend.service;

import com.example.backend.exception.*;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.utils.DistanceCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductShopRepository productShopRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ShopService shopService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private DistanceCalculator distanceCalculator;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserActivityRepository userActivityRepository;

    public ProductProfileDTO getProductProfile(Long productId, String token) {
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
                    reviewDTO.setAuthor(review.getAuthor().getName());
                    reviewDTO.setImagePath(review.getImagePath());
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

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if (user == null) {
            throw new UserNotFoundException("User not found");
        }

        double userLat = user.getLatitude();
        double userLon = user.getLongitude();

        if(userLat == 0 || userLon == 0) {
            productDTO.setDistance(-1);
        } else {
            productDTO.setDistance(distanceCalculator.calculateDistance(userLat, userLon, product.getShop().getLatitude(), product.getShop().getLongitude()));
        }

        return productDTO;
    }

    public List<ProductInfoDTO> getHoodProducts(String token) {
        List<ShopDistance> hoodShops = shopService.getHoodShops(token);

        List<ProductInfoDTO> hoodProducts = new ArrayList<>();
        for (ShopDistance shopDistance : hoodShops) {
            hoodProducts.addAll(shopDistance.getShopDTO().getProducts());
        }

        return hoodProducts;
    }

    public List<ProductInfoDTO> getAllProducts() {

        List<ProductShop> productShops = productShopRepository.findAll();

        List<ProductInfoDTO> products = new ArrayList<>();

        products = productShops
                .stream()
                .map(product -> new ProductInfoDTO(product))
                .toList();

        return products;
    }

    public String addProduct(AddProductDTO addProductDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        Shop shop = shopRepository.findById(addProductDTO.getShopId()).orElseThrow(() -> new ShopNotFoundException("Shop not found"));

        if(!email.equals(shop.getShopOwner().getEmail())) {
            throw new ShopDoesntBelongToGivenOwnerException("Shop doesn't belong to given owner");
        }

        Product product = productRepository.findById(addProductDTO.getProductId()).orElseThrow(() -> new ProductNotFoundException("Product not found"));

        ProductShop productShop = new ProductShop();
        productShop.setShop(shop);
        productShop.setProduct(product);
        productShop.setDescription(addProductDTO.getDescription());
        productShop.setPrice(addProductDTO.getPrice());
        productShop.setImagePath(addProductDTO.getImagePath());
        productShop.setQuantity(addProductDTO.getQuantity());
        ProductShop addedProduct = productShopRepository.save(productShop);

        UserActivity userActivity = new UserActivity();
        userActivity.setUser(user);
        userActivity.setActivityType(ActivityType.ADDED_PRODUCT);
        userActivity.setDateTime(LocalDateTime.now());
        userActivity.setNote("Added product with id = " + addedProduct.getId() + " to shop with id = " + shop.getId());
        userActivityRepository.save(userActivity);

        return "Successfully added product";
    }

    public String editProduct(AddProductDTO editProductDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        ProductShop productShop = productShopRepository.findById(editProductDTO.getId()).orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if(!productShop.getShop().getShopOwner().getEmail().equals(email)) {
            throw new ShopDoesntBelongToGivenOwnerException("Shop doesn't belong to given owner");
        }

        if(editProductDTO.getDescription() != null)
            productShop.setDescription(editProductDTO.getDescription());

        if(editProductDTO.getPrice() != 0)
            productShop.setPrice(editProductDTO.getPrice());

        if(editProductDTO.getImagePath() != null)
            productShop.setImagePath(editProductDTO.getImagePath());

        productShopRepository.save(productShop);

        UserActivity userActivity = new UserActivity();
        userActivity.setUser(user);
        userActivity.setActivityType(ActivityType.EDITED_PRODUCT);
        userActivity.setDateTime(LocalDateTime.now());
        userActivity.setNote("Edited product with id = " + productShop.getId());
        userActivityRepository.save(userActivity);

        return "Product successfully updated";
    }
}
