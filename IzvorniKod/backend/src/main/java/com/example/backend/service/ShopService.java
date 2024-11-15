package com.example.backend.service;

import com.example.backend.model.Person;
import com.example.backend.model.Shop;
import com.example.backend.model.ShopDistance;
import com.example.backend.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PersonService personService;

    public List<Shop> findAll() {
        return shopRepository.findAll();
    }

    public Shop saveShop (Shop shop) {
        return shopRepository.save(shop);
    }

    public void removeShop (Long id) {
        shopRepository.deleteShopById(id);
    }

    public ResponseEntity<List<ShopDistance>> getShopsSortedByNameAsc(String authHeader) {

        String token = authHeader.substring(7);

        Person user = personService.findUser(jwtService.extractUsername(token));

        double userLatitude = user.getLatitude();
        double userLongitude = user.getLongitude();

        List<Shop> shops = shopRepository.findAllSortedByNameAsc();

        DecimalFormat df = new DecimalFormat("#.#");

        List<ShopDistance> shopsWithDistance = new ArrayList<>();

        for(Shop shop : shops) {
            double distance = calculateDistance(userLatitude, userLongitude, shop.getLatitude(), shop.getLongitude());
            double roundedDistance = Double.parseDouble(df.format(distance));
            shopsWithDistance.add(new ShopDistance(shop, roundedDistance));
        }

        return ResponseEntity.ok(shopsWithDistance);
    }

    public ResponseEntity<List<ShopDistance>> getShopsSortedByNameDesc(String authHeader) {

        String token = authHeader.substring(7);

        Person user = personService.findUser(jwtService.extractUsername(token));

        double userLatitude = user.getLatitude();
        double userLongitude = user.getLongitude();

        List<Shop> shops = shopRepository.findAllSortedByNameDesc();

        DecimalFormat df = new DecimalFormat("#.#");

        List<ShopDistance> shopsWithDistance = new ArrayList<>();

        for(Shop shop : shops) {
            double distance = calculateDistance(userLatitude, userLongitude, shop.getLatitude(), shop.getLongitude());
            double roundedDistance = Double.parseDouble(df.format(distance));
            shopsWithDistance.add(new ShopDistance(shop, roundedDistance));
        }

        return ResponseEntity.ok(shopsWithDistance);
    }

    public ResponseEntity<List<ShopDistance>> getShopsSortedByDistanceAsc(String authHeader) {

        String token = authHeader.substring(7);

        Person user = personService.findUser(jwtService.extractUsername(token));

        double userLatitude = user.getLatitude();
        double userLongitude = user.getLongitude();

        List<Shop> shops = shopRepository.findAllSortedByNameAsc();

        DecimalFormat df = new DecimalFormat("#.#");

        List<ShopDistance> shopsWithDistance = new ArrayList<>();

        for(Shop shop : shops) {
            double distance = calculateDistance(userLatitude, userLongitude, shop.getLatitude(), shop.getLongitude());
            double roundedDistance = Double.parseDouble(df.format(distance));
            shopsWithDistance.add(new ShopDistance(shop, roundedDistance));
        }

        shopsWithDistance.sort(Comparator.comparingDouble(ShopDistance::getDistance));

        return ResponseEntity.ok(shopsWithDistance);
    }

    public ResponseEntity<Map<String, Object>> addShop(MultipartFile file, String shopName, double latitude, double longitude, String description, String authHeader) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String folderPath = "../frontend/public/userUploads/";

        try {

            File directory = new File(folderPath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String email = jwtService.extractUsername(authHeader.substring(7));
            String emailNoPeriods = email.replaceAll("\\.", "");

            Person owner = personService.findUser(email);

            int index = owner.getShops().size();

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = emailNoPeriods + "_shop" + index + extension; // e.g. asd@gmailcom_shop0.png

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

            String frontendPath = "/userUploads/" + newFilename;

            Shop shop = new Shop();
            shop.setShopName(shopName);
            shop.setLatitude(latitude);
            shop.setLongitude(longitude);
            shop.setImagePath(frontendPath);
            shop.setDescription(description);

            shop.setShopOwner(owner);

            saveShop(shop);

            return ResponseEntity.ok(Map.of("filePath", frontendPath));

        } catch (IOException e) {
            System.out.println("Error occurred while saving file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Haversina formula umjesto google distance matrix api
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {

        double lat1Rad = Math.toRadians(lat1);
        double lon1Rad = Math.toRadians(lon1);
        double lat2Rad = Math.toRadians(lat2);
        double lon2Rad = Math.toRadians(lon2);

        double deltaLat = lat2Rad - lat1Rad;
        double deltaLon = lon2Rad - lon1Rad;

        double a = Math.pow(Math.sin(deltaLat / 2), 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.pow(Math.sin(deltaLon / 2), 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return 6371 * c; // u kilometrima
    }

    /*   FUNKCIJE KOJE KORISTE GOOGLE DISTANCE MATRIX API ZA DOHVAT UDALJENOST IZMEDJU DVIJE TOCKE -
            lista wrappana u mono vraca 401 na frontend iz nekog razloga

    public Mono<List<ShopDistance>> getSortedShopsByDistance(double targetLat, double targetLon, List<Shop> shops) {
        return getShopsDistance(targetLat, targetLon, shops).map(shopList ->
                shopList.stream()
                        .sorted(Comparator.comparingDouble(ShopDistance::getDistance))
                        .collect(Collectors.toList())
        );
    }

    public Mono<List<ShopDistance>> getShopsDistance(double targetLat, double targetLon, List<Shop> shops) {
        // Create the destinations string for the API request
        String destinations = shops.stream()
                .map(shop -> shop.getLatitude() + "," + shop.getLongitude())
                .collect(Collectors.joining("|"));

        // Build the URL for the API request
        String urlString = String.format(
                "https://maps.googleapis.com/maps/api/distancematrix/json?origins=%f,%f&destinations=%s&key=%s",
                targetLat, targetLon, destinations, "AIzaSyDmSd-LnmMFJX2-dwYFswLOknTLajTLVFM");

        // Make the HTTP request using WebClient
        WebClient webClient = webClientBuilder.baseUrl(urlString).build();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.build())
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    // Parse the response and return the list of ShopDistance objects
                    List<ShopDistance> shopDistances = new ArrayList<>();
                    try {
                        // Use Jackson's ObjectMapper to parse the JSON response
                        ObjectMapper objectMapper = new ObjectMapper();
                        JsonNode jsonResponse = objectMapper.readTree(response);

                        JsonNode elements = null;
                        // Get the elements array
                        JsonNode rows = jsonResponse.path("rows");  // Access the "rows" field
                        if (!rows.isMissingNode() && rows.isArray() && rows.size() > 0) {
                            JsonNode firstRow = rows.get(0);  // Get the first element in the array
                            if (!firstRow.isMissingNode()) {
                                elements = firstRow.path("elements");  // Access the "elements" field
                                // Now you can safely use "elements"
                            }
                        }

                        if(elements != null) {
                            for (int i = 0; i < elements.size(); i++) {
                                double distanceInMeters = elements.get(i).path("distance").path("value").asDouble();
                                int shopId = shops.get(i).getId().intValue();
                                String shopName = shops.get(i).getShopName();
                                shopDistances.add(new ShopDistance(shopId, shopName, distanceInMeters));
                            }
                        }

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    // Sort shops by distance
                    return shopDistances;
                });
    }

    */
}
