package com.example.backend.service;

import com.example.backend.exception.NoLocationPermissionException;
import com.example.backend.exception.ProductNotFoundException;
import com.example.backend.exception.ShopNotFoundException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.utils.DistanceCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
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

    public List<ProductInfoDTO> getHoodProducts(String token, double radius) {
        List<ShopDistance> hoodShops = shopService.getHoodShops(token, radius);

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

    public String addProduct(AddProductDTO addProductDTO) {

        Shop shop = shopRepository.findById(addProductDTO.getShopId()).orElseThrow(() -> new ShopNotFoundException("Shop not found"));

        Product product = productRepository.findById(addProductDTO.getProductId()).orElseThrow(() -> new ProductNotFoundException("Product not found"));

        ProductShop productShop = new ProductShop();
        productShop.setShop(shop);
        productShop.setProduct(product);
        productShop.setDescription(addProductDTO.getDescription());
        productShop.setPrice(addProductDTO.getPrice());
        productShop.setImagePath(addProductDTO.getImagePath());
        productShopRepository.save(productShop);

        return "Successfully added product";
    }

    public String editProduct(AddProductDTO editProductDTO) {

        ProductShop productShop = productShopRepository.findById(editProductDTO.getId()).orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if(editProductDTO.getDescription() != null)
            productShop.setDescription(editProductDTO.getDescription());

        if(editProductDTO.getPrice() != 0)
            productShop.setPrice(editProductDTO.getPrice());

        if(editProductDTO.getImagePath() != null)
            productShop.setImagePath(editProductDTO.getImagePath());

        productShopRepository.save(productShop);

        return "Product successfully updated";
    }
}
