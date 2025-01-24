package com.example.backend.service;

import com.example.backend.dto.AddEventDTO;
import com.example.backend.dto.EventDTO;
import com.example.backend.enums.ActivityType;
import com.example.backend.dto.ShopDistance;
import com.example.backend.exception.ShopNotFoundException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.PersonRepository;
import com.example.backend.repository.ShopRepository;
import com.example.backend.repository.UserActivityRepository;
import com.example.backend.utils.DistanceCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

    @Value("${spring.boot.web.url.img}")
    private String web_url_img;

    @Autowired
    private UserActivityRepository userActivityRepository;

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
                        event.getId(),
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

    public List<EventDTO> getHoodEvents(String token) {

        List<ShopDistance> hoodShops = shopService.getHoodShops(token);

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

        if(eventDTO.getFile() != null) {
            String folderPath = "public/userUploads/";

            try {

                File directory = new File(folderPath);
                if (!directory.exists()) {
                    directory.mkdirs();
                }

                String sanitizedShopName = shop.getShopName().replaceAll("[^a-zA-Z0-9]", ""); // ukloni sve sto nije broj ili slovo

                int index = 0;
                List<Event> events = shop.getEvents();

                for (Event event : events) {
                    String imagePath = event.getImagePath();
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

                frontendPath = "http://" + web_url_img + "/userUploads/" + newFilename;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        Event event = new Event();
        event.setName(eventDTO.getName());
        event.setDescription(eventDTO.getDescription());
        event.setAddress(eventDTO.getAddress());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        LocalDateTime dateTime =  LocalDateTime.parse(eventDTO.getDateTime(), formatter);
        event.setDateTime(dateTime);
        event.setDuration(eventDTO.getDuration());
        event.setImagePath(frontendPath);
        event.setFrequency(eventDTO.getFrequency());

        event.setShop(shop);

        shop.getEvents().add(event);
        Shop savedShop = shopRepository.save(shop);

        UserActivity userActivity = new UserActivity();
        userActivity.setUser(user);
        userActivity.setActivityType(ActivityType.ADDED_EVENT);
        userActivity.setDateTime(LocalDateTime.now());
        userActivity.setNote("Added event with id = " + savedShop.getEvents().getLast().getId());

        userActivityRepository.save(userActivity);

        return "Event added successfully";
    }

    public String editEvent(AddEventDTO editEventDTO) {

        Event event = eventRepository.findById(editEventDTO.getId()).orElse(null);

        if (event != null) {
            if (editEventDTO.getName() != null) {
                event.setName(editEventDTO.getName());
            }
            if (editEventDTO.getDescription() != null) {
                event.setDescription(editEventDTO.getDescription());
            }
            if (editEventDTO.getDateTime() != null) {
                try {
                    LocalDateTime dateTime = LocalDateTime.parse(editEventDTO.getDateTime());
                    event.setDateTime(dateTime);
                } catch (Exception e) {
                    return "Invalid date time format!";
                }
            }
            if (editEventDTO.getFrequency() != null) {
                event.setFrequency(editEventDTO.getFrequency());
            }
            if (editEventDTO.getDuration() != null) {
                event.setDuration(editEventDTO.getDuration());
            }
            if (editEventDTO.getAddress() != null) {
                event.setAddress(editEventDTO.getAddress());
            }

            eventRepository.save(event);
        }

        return "Event updated successfully!";
    }

    public List<EventDTO> getMyEvents(String token) {

        List<Event> events = eventRepository.findAll();

        String email = jwtService.extractUsername(token);

        return events.stream()
                .filter(event -> event.getShop().getShopOwner().getEmail().equals(email))
                .map(event -> new EventDTO(
                        event.getId(),
                        event.getName(),
                        event.getDescription(),
                        event.getAddress(),
                        event.getDateTime(),
                        event.getDuration(),
                        event.getImagePath(),
                        event.getShop().getId(),
                        event.getShop().getShopName(),
                        -1
                ))
                .collect(Collectors.toList());
    }

    public EventDTO getEvent(Long eventId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if(eventId != null) {
            return new EventDTO(
                    eventId,
                    event.getName(),
                    event.getDescription(),
                    event.getAddress(),
                    event.getDateTime(),
                    event.getDuration(),
                    event.getImagePath(),
                    event.getShop().getId(),
                    event.getShop().getShopName(),
                    -1
            );
        }

        return null;

    }
}
