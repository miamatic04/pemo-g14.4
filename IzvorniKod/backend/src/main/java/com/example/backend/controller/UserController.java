package com.example.backend.controller;

import com.example.backend.model.Person;
import com.example.backend.model.RegistrationInfo;
import com.example.backend.service.JWTService;
import com.example.backend.service.ShopService;
import com.example.backend.service.PersonService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private PersonService personService;

    @Autowired
    JWTService jwtService;

    @PostMapping("/register/addUser")
    public ResponseEntity<Map<String, Object>> addUser(@RequestBody RegistrationInfo registrationInfo) throws MessagingException {
        return personService.addUser(registrationInfo);
    }

    @GetMapping("/confirmEmail")
    public RedirectView confirmEmail(@RequestParam("token") String confirmationToken) {
        return personService.confirmEmail(confirmationToken);
    }

}
