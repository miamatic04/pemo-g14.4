package com.example.backend.service;
import java.text.DecimalFormatSymbols;
import java.time.LocalDateTime;
import java.util.Locale;

import com.example.backend.dto.AddShopDTO;
import com.example.backend.dto.ShopProfileDTO;
import com.example.backend.enums.ActivityType;
import com.example.backend.enums.Hood;
import com.example.backend.dto.ShopDistance;
import com.example.backend.exception.HoodNotChosenException;
import com.example.backend.exception.NoLocationPermissionException;
import com.example.backend.exception.ShopNotFoundException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.ProductShopRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.ShopRepository;
import com.example.backend.repository.UserActivityRepository;
import com.example.backend.utils.DistanceCalculator;
import com.example.backend.utils.Recommend;
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

    @Autowired
    private ProductShopRepository productShopRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private DistanceCalculator distanceCalculator;

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Autowired
    private Recommend recommend;

    @Value("${spring.boot.web.url.img}")
    private String web_url_img;

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
            double distance = distanceCalculator.calculateDistance(userLatitude, userLongitude, shop.getLatitude(), shop.getLongitude());
            String formattedDistance = df.format(distance).replace(",", ".");
            double roundedDistance = Double.parseDouble(formattedDistance);
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
            double distance = distanceCalculator.calculateDistance(userLatitude, userLongitude, shop.getLatitude(), shop.getLongitude());
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
            double distance = distanceCalculator.calculateDistance(userLatitude, userLongitude, shop.getLatitude(), shop.getLongitude());
            double roundedDistance = Double.parseDouble(df.format(distance));
            shopsWithDistance.add(new ShopDistance(shop, roundedDistance));
        }

        shopsWithDistance.sort(Comparator.comparingDouble(ShopDistance::getDistance));

        return ResponseEntity.ok(shopsWithDistance);
    }

    public ResponseEntity<List<ShopDistance>> getRecommendedShopsSortedByNameAsc(String authHeader) {

        String email = jwtService.extractUsername(authHeader.substring(7));

        List<ShopDistance> shopsWithDistance = recommend.recommendShops(email);

        shopsWithDistance.sort(Comparator.comparing(shopDistance -> shopDistance.getShopDTO().getShopName()));

        return ResponseEntity.ok(shopsWithDistance);
    }

    public ResponseEntity<List<ShopDistance>> getRecommendedShopsSortedByNameDesc(String authHeader) {

        String email = jwtService.extractUsername(authHeader.substring(7));

        List<ShopDistance> shopsWithDistance = recommend.recommendShops(email);

        shopsWithDistance.sort(
                Comparator.comparing(shopDistance -> shopDistance.getShopDTO().getShopName(), Comparator.reverseOrder())
        );

        return ResponseEntity.ok(shopsWithDistance);
    }

    public ResponseEntity<List<ShopDistance>> getRecommendedShopsSortedByDistanceAsc(String authHeader) {

        String email = jwtService.extractUsername(authHeader.substring(7));

        List<ShopDistance> shopsWithDistance = recommend.recommendShops(email);

        shopsWithDistance.sort(Comparator.comparingDouble(ShopDistance::getDistance));

        return ResponseEntity.ok(shopsWithDistance);
    }

    public ResponseEntity<Map<String, Object>> addShop(AddShopDTO addShopDTO, String authHeader) {

        if (addShopDTO.getFile().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String folderPath = "public/userUploads/";

        try {

            File directory = new File(folderPath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String email = jwtService.extractUsername(authHeader.substring(7));
            String emailNoPeriods = email.replaceAll("\\.", "");

            Person owner = personService.findUser(email);

            int index = 0;
            List<Shop> shops = owner.getShops();

            for (Shop shop : shops) {
                String imagePath = shop.getImagePath();
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

            String originalFilename = StringUtils.cleanPath(addShopDTO.getFile().getOriginalFilename());
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

            Files.copy(addShopDTO.getFile().getInputStream(), targetLocation);

            String frontendPath = "http://" + web_url_img + "/userUploads/" + newFilename;

            Shop shop = new Shop();
            shop.setShopName(addShopDTO.getShopName());
            shop.setLatitude(addShopDTO.getLatitude());
            shop.setLongitude(addShopDTO.getLongitude());
            shop.setImagePath(frontendPath);
            shop.setDescription(addShopDTO.getDescription());

            shop.setHood(Hood.valueOf(addShopDTO.getHood()));

            shop.setShopOwner(owner);

            Shop savedShop = saveShop(shop);

            UserActivity userActivity = new UserActivity();
            userActivity.setUser(owner);
            userActivity.setActivityType(ActivityType.CREATED_SHOP);
            userActivity.setDateTime(LocalDateTime.now());
            userActivity.setNote("User " + owner.getEmail() + " created shop with id = " + savedShop.getId());
            userActivityRepository.save(userActivity);

            return ResponseEntity.ok(Map.of("filePath", frontendPath));

        } catch (IOException e) {
            System.out.println("Error occurred while saving file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ShopProfileDTO getShopProfileDetails(Long shopId, String token) {
        // Pronalaženje trgovine
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        String email = jwtService.extractUsername(token);

        Person user = personService.findUser(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        boolean isOwner = false;
        if(user.getEmail().equals(shop.getShopOwner().getEmail())) {
            isOwner = true;
        }

        // Kreiranje ShopDTO objekta
        return new ShopProfileDTO(shop, isOwner);
    }

    public List<ShopDistance> getHoodShops(String token) {

        String email = jwtService.extractUsername(token);

        Person user = personService.findUser(email);

        if(user == null)
            throw new UserNotFoundException("User not found");

        double userLatitude = user.getLatitude();
        double userLongitude = user.getLongitude();

        if(userLatitude == 0 || userLongitude == 0)
            throw new NoLocationPermissionException("Location permission denied");

        List<Shop> shops = shopRepository.findAllSortedByNameAsc();

        List<Shop> hoodShops = new ArrayList<>();

        if(user.getHood() == null)
            throw new HoodNotChosenException("Hood not chosen: please choose one in profile settings");

        hoodShops = shops
                .stream()
                .filter((shop) -> shop.getHood().equals(user.getHood()))
                .toList();

        DecimalFormat df = new DecimalFormat("#.#");
        df.setDecimalFormatSymbols(new DecimalFormatSymbols(Locale.US));

        List<ShopDistance> shopsWithDistance = new ArrayList<>();

        for(Shop shop : hoodShops) {
            double distance = distanceCalculator.calculateDistance(userLatitude, userLongitude, shop.getLatitude(), shop.getLongitude());
            String formattedDistance = df.format(distance);
            double roundedDistance = Double.parseDouble(formattedDistance);
            shopsWithDistance.add(new ShopDistance(shop, roundedDistance));
        }

        return shopsWithDistance;
    }

    public String editShop(AddShopDTO editShopDTO) {

        Shop shop = shopRepository.findById(editShopDTO.getId()).orElseThrow(() -> new ShopNotFoundException("Shop not found"));

        if(editShopDTO.getShopName() != null)
            shop.setShopName(editShopDTO.getShopName());

        if(editShopDTO.getLatitude() != 0)
            shop.setLatitude(editShopDTO.getLatitude());

        if(editShopDTO.getLongitude() != 0)
            shop.setLongitude(editShopDTO.getLongitude());

        if(editShopDTO.getDescription() != null)
            shop.setDescription(editShopDTO.getDescription());

        if(editShopDTO.getImagePath() != null)
            shop.setImagePath(editShopDTO.getImagePath());

        shopRepository.save(shop);

        return "Shop edited successfully";
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
