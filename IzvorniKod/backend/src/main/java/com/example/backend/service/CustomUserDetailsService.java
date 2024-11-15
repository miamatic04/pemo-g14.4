package com.example.backend.service;

import com.example.backend.model.CustomUserDetails;
import com.example.backend.model.Person;
import com.example.backend.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private PersonRepository personRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Person user = personRepository.findByEmail(email);

        if (user == null) {
            throw new BadCredentialsException("User not found with email: " + email);
        }

        return new CustomUserDetails(user);

    }
}