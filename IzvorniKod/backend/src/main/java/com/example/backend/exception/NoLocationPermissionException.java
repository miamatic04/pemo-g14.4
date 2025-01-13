package com.example.backend.exception;

public class NoLocationPermissionException extends RuntimeException {
    public NoLocationPermissionException(String message) {
        super(message);
    }
}
