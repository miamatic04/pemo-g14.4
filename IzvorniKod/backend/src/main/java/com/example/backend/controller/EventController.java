package com.example.backend.controller;

import com.example.backend.dto.AddEventDTO;
import com.example.backend.dto.EventDTO;
import com.example.backend.service.EventService;
import com.example.backend.service.EventSignUpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventSignUpService eventSignUpService;

    @GetMapping("/getEvents")
    public ResponseEntity<List<EventDTO>> getAllEvents(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        List<EventDTO> events = eventService.getAllEvents(authHeader.substring(7));
        return ResponseEntity.ok(events);
    }

    @PostMapping("/signup/{eventId}")
    public ResponseEntity<String> signupForEvent(@PathVariable Long eventId, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        eventSignUpService.signUpForEvent(eventId, authHeader.substring(7));
        return ResponseEntity.ok("Signup successful");
    }

    @GetMapping("/hood/getEvents")
    public ResponseEntity<List<EventDTO>> getHoodEvents(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        List<EventDTO> events = eventService.getHoodEvents(authHeader.substring(7));
        return ResponseEntity.ok(events);
    }

    @PostMapping("/addEvent")
    public ResponseEntity<String> addEvent(@ModelAttribute AddEventDTO addEventDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(eventService.addEvent(addEventDTO, authHeader.substring(7)));
    }

    @GetMapping("/getMyEvents")
    public ResponseEntity<List<EventDTO>> getMyEvents(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(eventService.getMyEvents(authHeader.substring(7)));
    }

    @PostMapping("/editEvent")
    public ResponseEntity<String> editEvent(@RequestBody AddEventDTO editEventDTO) {
        return ResponseEntity.ok(eventService.editEvent(editEventDTO));
    }

    @GetMapping("/getEvent/{eventId}")
    public ResponseEntity<EventDTO> getMyEvents(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventService.getEvent(eventId));
    }
}
