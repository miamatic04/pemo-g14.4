package com.example.backend.exception;

public class CustomConstraintViolationException extends RuntimeException {
    public CustomConstraintViolationException(String message) {
        super(message);
    }
}
