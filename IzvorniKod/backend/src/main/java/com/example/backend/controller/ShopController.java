package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.service.JWTService;
import com.example.backend.service.PersonService;
import com.example.backend.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
public class ShopController {

    @Autowired
    private ShopService shopService;

    @Autowired
    private JWTService jwtService;
    @Autowired
    private PersonService personService;

    @GetMapping("/home/getShopsAZ")
    public ResponseEntity<List<ShopDistance>> getShopsAZ(@RequestHeader(value = "Authorization", required = false) String authHeader) {

        String token = authHeader.substring(7);

        return shopService.getShopsSortedByNameAsc(token);
    }

    @GetMapping("/home/getShopsZA")
    public ResponseEntity<List<ShopDistance>> getShopsZA(@RequestHeader(value = "Authorization", required = false) String authHeader) {

        String token = authHeader.substring(7);

        return shopService.getShopsSortedByNameDesc(token);
    }

    @GetMapping("/home/getShopsByDistanceAsc")
    public ResponseEntity<List<ShopDistance>> getShopsByDistanceAsc(@RequestHeader(value = "Authorization", required = false) String authHeader) {

        String token = authHeader.substring(7);

        return shopService.getShopsSortedByDistanceAsc(token);
    }

    @PostMapping("/addShop")
    public ResponseEntity<Map<String, Object>> addShop(
            @RequestParam("file") MultipartFile file,
            @RequestParam("shopName") String shopName,
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam("description") String description,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String folderPath = "../frontend/public/userUploads/";

        try {
            // Create directory if it doesn't exist
            File directory = new File(folderPath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Extract email from JWT token (assuming JWT service is already implemented)
            String email = jwtService.extractUsername(authHeader.substring(7));
            String emailNoPeriods = email.replaceAll("\\.", "");

            Person owner = personService.findUser(email);

            int index = owner.getShops().size();

            // Process the file (generate unique filename)
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = emailNoPeriods + "_shop" + index + extension; // e.g. asd@gmailcom_shop0.png

            // Create a Path for the target file
            Path targetLocation = Paths.get(folderPath + newFilename);

            // Save the file to the target location
            Files.copy(file.getInputStream(), targetLocation);

            String frontendPath = "/userUploads/" + newFilename;

            Shop shop = new Shop();
            shop.setShopName(shopName);
            shop.setLatitude(latitude);
            shop.setLongitude(longitude);
            shop.setImagePath(frontendPath);
            shop.setDescription(description);

            shop.setShopOwner(owner);

            shopService.saveShop(shop);

            return ResponseEntity.ok(Map.of("filePath", frontendPath));

        } catch (IOException e) {
            System.out.println("Error occurred while saving file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
