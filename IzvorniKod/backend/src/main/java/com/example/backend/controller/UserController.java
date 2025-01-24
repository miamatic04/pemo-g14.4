package com.example.backend.controller;

import com.example.backend.dto.EditProfileDTO;
import com.example.backend.dto.RegistrationInfo;
import com.example.backend.dto.UserDTO;
import com.example.backend.dto.UserProfileDTO;
import com.example.backend.service.JWTService;
import com.example.backend.service.PersonService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;
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

    @PostMapping("/editProfile")
    public ResponseEntity<String> editProfile(@RequestBody EditProfileDTO editProfileDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(personService.editProfile(editProfileDTO, authHeader.substring(7)));
    }

    @GetMapping("/getUsers")
    public ResponseEntity<List<UserDTO>> getUsers() {
        return ResponseEntity.ok(personService.getUsers());
    }

    @GetMapping("/getUserInfo")
    public ResponseEntity<UserProfileDTO> getInfo(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(personService.getUserProfile(authHeader.substring(7)));
    }

}
