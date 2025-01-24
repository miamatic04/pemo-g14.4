package com.example.backend.service;

import com.example.backend.enums.ActivityType;
import com.example.backend.exception.EventNotFoundException;
import com.example.backend.exception.UserAlreadySignedUpException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.EventSignUpRepository;
import com.example.backend.repository.PersonRepository;
import com.example.backend.repository.UserActivityRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EventSignUpService {

    @Autowired
    private EventSignUpRepository eventSignUpRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private JWTService jwtService;
    @Autowired
    private UserActivityRepository userActivityRepository;

    @Transactional
    public void signUpForEvent(Long eventId, String token) {

        String email = jwtService.extractUsername(token);

        Person person = personRepository.findByEmail(email);

        if(person == null) {
            throw new UserNotFoundException(email);
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event with id " + eventId + " not found"));

        boolean alreadySignedUp = eventSignUpRepository.existsByPersonAndEvent(person, event);
        if (alreadySignedUp) {
            throw new UserAlreadySignedUpException("This user is already signed up for this event.");
        }

        EventSignUp signup = new EventSignUp();
        signup.setPerson(person);
        signup.setEvent(event);

        eventSignUpRepository.save(signup);

        UserActivity userActivity = new UserActivity();
        userActivity.setUser(person);
        userActivity.setActivityType(ActivityType.SIGNED_UP_FOR_EVENT);
        userActivity.setDateTime(LocalDateTime.now());
        userActivity.setNote("Signed up for event with id = " + eventId);
        userActivityRepository.save(userActivity);
    }
}
