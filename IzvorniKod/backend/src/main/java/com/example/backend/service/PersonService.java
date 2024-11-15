package com.example.backend.service;

import com.example.backend.exception.CustomConstraintViolationException;
import com.example.backend.exception.EmailAlreadyInUseException;
import com.example.backend.exception.PasswordsDontMatchException;
import com.example.backend.model.*;
import com.example.backend.repository.PersonRepository;
import jakarta.mail.MessagingException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
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

    @Value("${spring.boot.web.url}")
    private String web_url;

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

        }

        return ResponseEntity.ok(response);

    }

    public RedirectView confirmEmail(String confirmationToken) {

        Person user = findUserByConfirmationToken(confirmationToken);

        if (user != null) {
                user.setEmailConfirmed(true);
                save(user);
                return new RedirectView("http://" + web_url + ":3000/?confirmed=true");
        }
        return new RedirectView("/?confirmed=false");
    }

}
