package com.example.backend.controller;

import com.example.backend.model.EventDTO;
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

    @GetMapping("/hood/getEvents/{radius}")
    public ResponseEntity<List<EventDTO>> getHoodEvents(@RequestHeader(value = "Authorization", required = false) String authHeader, double radius) {
        List<EventDTO> events = eventService.getHoodEvents(authHeader.substring(7), radius);
        return ResponseEntity.ok(events);
    }
}
