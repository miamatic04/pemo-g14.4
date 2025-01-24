package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.enums.ActivityType;
import com.example.backend.dto.ShopDistance;
import com.example.backend.exception.*;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.utils.DistanceCalculator;
import com.example.backend.utils.Recommend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    @Autowired
    private Recommend recommend;

    @Value("${spring.boot.web.url.img}")
    private String web_url_img;

    public ProductProfileDTO getProductProfile(Long productId, String token) {
        ProductShop product = productShopRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Fetching reviews related to the product
        List<Review> reviews = reviewRepository.findByProductShop(product);

        // Map the reviews to ReviewDTO
        List<ReviewDTO> reviewDTOs = reviews.stream()
                .map(review -> {
                    ReviewDTO reviewDTO = new ReviewDTO();
                    reviewDTO.setId(review.getId());
                    reviewDTO.setText(review.getText());
                    reviewDTO.setRating(review.getRating());
                    reviewDTO.setAuthor(review.getAuthor().getName());
                    reviewDTO.setImagePath(review.getImagePath());
                    return reviewDTO;
                })
                .collect(Collectors.toList());

        // Map the product data to ProductDTO
        ProductProfileDTO productDTO = new ProductProfileDTO();
        productDTO.setId(product.getId());
        productDTO.setQuantity(product.getQuantity());
        productDTO.setPlatformProduct(product.getProduct().getName());
        productDTO.setName(product.getProduct().getName());
        productDTO.setDescription(product.getDescription());
        productDTO.setPrice(product.getPrice());
        productDTO.setImagePath(product.getProduct().getImagePath());
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

    public List<ProductInfoDTO> getRecommendedProducts(String token) {
        String email = jwtService.extractUsername(token);

        return recommend.recommendProducts(email);
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

        productShopRepository.save(productShop);

        UserActivity userActivity = new UserActivity();
        userActivity.setUser(user);
        userActivity.setActivityType(ActivityType.EDITED_PRODUCT);
        userActivity.setDateTime(LocalDateTime.now());
        userActivity.setNote("Edited product with id = " + productShop.getId());
        userActivityRepository.save(userActivity);

        return "Product successfully updated";
    }

    public ResponseEntity<String> addProductToPlatform(PlatformProductDTO platformProductDTO, MultipartFile file, String token) throws IOException {

        String email = jwtService.extractUsername(token);

        Person admin = personRepository.findByEmail(email);

        if(admin == null) {
            throw new UserNotFoundException("Admin not found");
        }

        if(!admin.getRole().contains("admin"))
            throw new UnauthorizedActionException("Not an admin.");

        if (file.isEmpty()) {
            throw new ImageNotFoundException("Image not found. Make sure you provide an image.");
        }

        String folderPath = "public/userUploads/";

        try {

            File directory = new File(folderPath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            int index = 0;
            List<Product> products = productRepository.findAll();

            for (Product product : products) {
                String imagePath = product.getImagePath();
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

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = "product" + index + extension; // e.g. product7.png

            Path targetLocation = Paths.get(folderPath + newFilename);

            if (Files.exists(targetLocation)) {
                try {
                    Files.delete(targetLocation);
                } catch (IOException e) {
                    System.out.println("Error deleting existing file: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }

            Files.copy(file.getInputStream(), targetLocation);

            String frontendPath = "http://" + web_url_img + "/userUploads/" + newFilename;

            Product product = new Product();
            product.setName(platformProductDTO.getName());
            product.setCategory(platformProductDTO.getCategory());
            product.setImagePath(frontendPath);
            product.setAgeRestriction(platformProductDTO.getAgeRestriction());

            productRepository.save(product);

        } catch (IOException e) {
            System.out.println("Error occurred while saving file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok("Product added successfully");
    }

    public List<PlatformProductDTO> getPlatformProducts() {
        List<Product> products = productRepository.findAll();

        return products
                .stream()
                .map((product) -> {
                    PlatformProductDTO platformProductDTO = new PlatformProductDTO();
                    platformProductDTO.setCategory(product.getCategory());
                    platformProductDTO.setName(product.getName());
                    platformProductDTO.setAgeRestriction(product.getAgeRestriction());
                    platformProductDTO.setImagePath(product.getImagePath());
                    platformProductDTO.setId(product.getId());
                    return platformProductDTO;
                })
                .toList();
    }
}

