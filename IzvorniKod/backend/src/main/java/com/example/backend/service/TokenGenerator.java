package com.example.backend.service;

import org.springframework.stereotype.Service;

import java.util.UUID;

public class TokenGenerator {

    public static String generateToken() {
        return UUID.randomUUID().toString();
    }
}