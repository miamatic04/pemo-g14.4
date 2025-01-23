package com.example.backend.service;

import com.example.backend.exception.*;
import com.example.backend.model.*;
import com.example.backend.repository.PersonRepository;
import com.example.backend.repository.UserActivityRepository;
import jakarta.mail.MessagingException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.servlet.view.RedirectView;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PersonService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Value("${spring.boot.web.url}")
    private String web_url;

    @Value("${spring.boot.web.url.img}")
    private String web_url_img;

    public Person findUser(String email) {
        return personRepository.findByEmail(email);
    }

    public Person findUserByConfirmationToken(String confirmationToken) {
        return personRepository.findByConfirmationToken(confirmationToken);
    }

    public Person save(Person shopUser) {
        return personRepository.save(shopUser);
    }



    public ResponseEntity<Map<String, Object>> addUser(RegistrationInfo registrationInfo) throws MessagingException {

        Map<String, Object> response = new HashMap<>();

        if (findUser(registrationInfo.getEmail()) != null) {
            throw new EmailAlreadyInUseException("Email already in use");
        } else if (!registrationInfo.getPass().equals(registrationInfo.getPassConfirm())) {
            throw new PasswordsDontMatchException("Passwords don't match");
        } else {
            response.put("message", "Account successfully created");
            registrationInfo.setPass(passwordEncoder.encode(registrationInfo.getPass()));
            Person user = new Person(registrationInfo);
            save(user);
            String subject = "Potvrdite registraciju";
            String text = "<html><body><h2>Dobrodošli!</h2>"
                    + "<p>Vaša registracija je uspješna. Molimo pritisnite na link kako biste potvrdili svoj email:</p>"
                    + "<a href=\"http://" + web_url + ":8080/confirmEmail?token=" + user.getConfirmationToken() + "\">Potvrdi email</a>"
                    + "</body></html>";

            emailService.sendConfirmationEmail(user.getEmail(), subject, text);

            UserActivity userActivity = new UserActivity();
            userActivity.setUser(user);
            userActivity.setActivityType(ActivityType.REGISTERED);
            userActivity.setDateTime(LocalDateTime.now());
            userActivity.setNote("User registered with email " + user.getEmail());
            userActivityRepository.save(userActivity);

        }

        return ResponseEntity.ok(response);

    }

    public RedirectView confirmEmail(String confirmationToken) {

        Person user = findUserByConfirmationToken(confirmationToken);

        if (user != null) {
                user.setEmailConfirmed(true);
                save(user);
                return new RedirectView("http://" + web_url + "/?confirmed=true");
        }
        return new RedirectView("/?confirmed=false");
    }

    public String editProfile(EditProfileDTO editProfileDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(editProfileDTO.getDateOfBirth() != null) {
            user.setDateOfBirth(editProfileDTO.getDateOfBirth());
        }

        if(editProfileDTO.getHood() != null) {
            String hood = editProfileDTO.getHood().toUpperCase();
            hood = hood.replaceAll(" ", "_");
            user.setHood(Hood.valueOf(hood));
        }

        personRepository.save(user);

        return "User profile updated successfully.";
    }

    public List<UserDTO> getUsers() {

        List<Person> users = personRepository.findAll();

        List<UserDTO> userDTOs = new ArrayList<>();

        userDTOs = users
                .stream()
                .filter((user) -> user.getRole().contains("owner") || user.getRole().contains("user") || user.getRole().contains("moderator"))
                .map((user) -> {
                    UserDTO userDTO = new UserDTO();
                    userDTO.setEmail(user.getEmail());
                    userDTO.setName(user.getName());
                    return userDTO;
                })
                .toList();

        return userDTOs;
    }

    public UserProfileDTO getUserProfile(String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setFirstName(user.getFirstName());
        userProfileDTO.setLastName(user.getLastName());
        userProfileDTO.setHood(user.getHood());
        userProfileDTO.setEmail(user.getEmail());
        if(user.getDateOfBirth() != null)
            userProfileDTO.setDateOfBirth(user.getDateOfBirth().toString());
        return userProfileDTO;
    }

}
