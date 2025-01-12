package com.example.backend.service;

import com.example.backend.exception.NoLocationPermissionException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.PersonRepository;
import com.example.backend.utils.DistanceCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
