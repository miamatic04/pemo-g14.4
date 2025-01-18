package com.example.backend.controller;

import com.example.backend.model.Person;
import com.example.backend.repository.PersonRepository;
import com.example.backend.service.GoogleCalendarService;
import com.example.backend.service.JWTService;
import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.services.calendar.Calendar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;

@RestController
public class CalendarController {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private GoogleCalendarService googleCalendarService;

    // aplikacija mora bit verificirana za koristiti google calendar API :(
    /*@PostMapping("/addEventToCalendar")
    public ResponseEntity<String> addEvent(@RequestHeader(value = "Authorization", required = false) String authHeader) throws GeneralSecurityException, IOException {

        String email = jwtService.extractUsername(authHeader.substring(7));

        Person user = personRepository.findByEmail(email);

        Credential credential = new Credential(BearerToken.authorizationHeaderAccessMethod()).setAccessToken(user.getGoogleAccessToken());
        Calendar calendarService = googleCalendarService.getCalendarService(credential);

        googleCalendarService.addEventToCalendar(calendarService);

        return ResponseEntity.ok("Event added successfully.");
    }*/
}
