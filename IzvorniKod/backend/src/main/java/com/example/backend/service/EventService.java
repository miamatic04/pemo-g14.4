package com.example.backend.service;

import com.example.backend.exception.NoLocationPermissionException;
import com.example.backend.exception.ShopNotFoundException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.PersonRepository;
import com.example.backend.repository.ShopRepository;
import com.example.backend.utils.DistanceCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

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

    public List<EventDTO> getAllEvents(String token) {

        List<Event> events = eventRepository.findAll();

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        double userLatitude = user.getLatitude();
        double userLongitude = user.getLongitude();

        return events.stream()
                .map(event -> new EventDTO(
                        event.getName(),
                        event.getDescription(),
                        event.getAddress(),
                        event.getDateTime(),
                        event.getDuration(),
                        event.getImagePath(),
                        event.getShop().getId(),
                        event.getShop().getShopName(),
                        distanceCalculator.calculateDistance(userLatitude, userLongitude, event.getShop().getLatitude(), event.getShop().getLongitude())
                ))
                .collect(Collectors.toList());
    }

    public List<EventDTO> getHoodEvents(String token, double radius) {

        List<ShopDistance> hoodShops = shopService.getHoodShops(token, radius);

        List<EventDTO> events = new ArrayList<>();

        for (ShopDistance shopDistance : hoodShops) {
            events.addAll(shopDistance.getShopDTO().getEvents());
        }

        return events;
    }

    public String addEvent(AddEventDTO eventDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        String frontendPath = null;

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        Shop shop = shopRepository.findById(eventDTO.getShopId()).orElseThrow(() -> new ShopNotFoundException("Shop not found"));

        if(eventDTO.getFile().getOriginalFilename() != null) {
            String folderPath = "public/userUploads/";

            try {

                File directory = new File(folderPath);
                if (!directory.exists()) {
                    directory.mkdirs();
                }

                String sanitizedShopName = shop.getShopName().replaceAll("[^a-zA-Z0-9]", ""); // ukloni sve sto nije broj ili slovo

                int index = shop.getEvents().size();

                String originalFilename = StringUtils.cleanPath(eventDTO.getFile().getOriginalFilename());
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String newFilename = sanitizedShopName + "_event" + index + extension; // e.g. asd@gmailcom_event0.png

                Path targetLocation = Paths.get(folderPath + newFilename);

                if (Files.exists(targetLocation)) {
                    try {
                        Files.delete(targetLocation);
                    } catch (IOException e) {
                        System.out.println("Error deleting existing file: " + e.getMessage());
                        return "Error deleting existing file";
                    }
                }

                Files.copy(eventDTO.getFile().getInputStream(), targetLocation);

                frontendPath = "/userUploads/" + newFilename;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        Event event = new Event();
        event.setName(eventDTO.getName());
        event.setDescription(eventDTO.getDescription());
        event.setAddress(eventDTO.getAddress());
        event.setDateTime(eventDTO.getDateTime());
        event.setDuration(eventDTO.getDuration());
        event.setImagePath(frontendPath);
        event.setFrequency(eventDTO.getFrequency());

        event.setShop(shop);

        shop.getEvents().add(event);
        shopRepository.save(shop);

        return "Event added successfully";
    }
}
