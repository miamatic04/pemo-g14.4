package com.example.backend.service;

import com.example.backend.model.CustomUserDetails;
import com.example.backend.model.ShopUser;
import com.example.backend.repository.ShopUserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final ShopUserRepository shopUserRepository;

    public CustomUserDetailsService(ShopUserRepository shopUserRepository) {
        this.shopUserRepository = shopUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        ShopUser user = shopUserRepository.findByEmail(email);

        if (user == null) {
            throw new BadCredentialsException("User not found with email: " + email);
        }

        return new CustomUserDetails(user);

    }
}