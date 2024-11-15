package com.example.backend.service;

import com.example.backend.exception.CustomConstraintViolationException;
import com.example.backend.exception.EmailAlreadyInUseException;
import com.example.backend.exception.PasswordsDontMatchException;
import com.example.backend.model.*;
import com.example.backend.repository.PersonRepository;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.HashMap;
import java.util.Map;

@Service
public class PersonService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Person findUser(String email) {
        return personRepository.findByEmail(email);
    }

    public Person save(Person shopUser) {
        return personRepository.save(shopUser);
    }

    public ResponseEntity<Map<String, Object>> addUser(RegistrationInfo registrationInfo) {

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
        }

        return ResponseEntity.ok(response);
    }

}
