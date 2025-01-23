package com.example.backend.exception;

public class RequestAlreadySubmittedException extends RuntimeException {
    public RequestAlreadySubmittedException(String message) {
        super(message);
    }
}
