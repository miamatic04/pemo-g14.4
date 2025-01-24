package com.example.backend.exception;

public class UserAlreadySignedUpException extends RuntimeException {
    public UserAlreadySignedUpException(String message) {
        super(message);
    }
}
