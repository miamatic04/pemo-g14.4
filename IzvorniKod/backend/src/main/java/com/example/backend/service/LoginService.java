package com.example.backend.service;

import com.example.backend.exception.EmailNotConfirmedException;
import com.example.backend.exception.InvalidLoginException;
import com.example.backend.enums.ActivityType;
import com.example.backend.dto.LoginInfo;
import com.example.backend.model.Person;
import com.example.backend.model.UserActivity;
import com.example.backend.repository.PersonRepository;
import com.example.backend.repository.UserActivityRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class LoginService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PersonService personService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserActivityRepository userActivityRepository;

    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginInfo loginInfo) throws JsonProcessingException {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginInfo.getEmail(), loginInfo.getPass()));

        if(authentication.isAuthenticated()) {

            if(personService.findUser(loginInfo.getEmail()).getEmailConfirmed()) {
                Map<String, Object> response = new HashMap<>();
                String token = jwtService.generateToken(loginInfo.getEmail());
                response.put("token", token);
                response.put("role", authentication.getAuthorities().toString());

                Long activeOrderId = orderService.getActiveOrder(token).getId();

                response.put("activeOrderId", activeOrderId);

                Person user = personRepository.findByEmail(loginInfo.getEmail());

                UserActivity userActivity = new UserActivity();
                userActivity.setUser(user);
                userActivity.setActivityType(ActivityType.LOGGED_IN);
                userActivity.setNote("User " + user.getEmail() + " logged in");
                userActivity.setDateTime(LocalDateTime.now());
                userActivityRepository.save(userActivity);

                return ResponseEntity.ok(response);
            } else
                throw new EmailNotConfirmedException("Email not confirmed.");

        }

        throw new InvalidLoginException("Invalid login credentials.");
    }
}
