package com.example.backend.exception;

public class InvalidRoleException extends RuntimeException {
    public InvalidRoleException(String message) {
        super(message);
    }
}
