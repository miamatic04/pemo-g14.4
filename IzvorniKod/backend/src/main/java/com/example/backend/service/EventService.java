package com.example.backend.service;

import com.example.backend.model.Event;
import com.example.backend.model.EventDTO;
import com.example.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<EventDTO> getAllEvents() {
        List<Event> events = eventRepository.findAll();

        return events.stream()
                .map(event -> new EventDTO(
                        event.getName(),
                        event.getDescription(),
                        event.getAddress(),
                        event.getDateTime(),
                        event.getDuration(),
                        event.getImagePath(),
                        event.getShop()
                ))
                .collect(Collectors.toList());
    }
}
