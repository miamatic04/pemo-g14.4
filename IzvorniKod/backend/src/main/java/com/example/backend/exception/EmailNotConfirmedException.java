package com.example.backend.exception;

public class EmailNotConfirmedException extends RuntimeException {
    public EmailNotConfirmedException(String message) {
        super(message);
    }
}
