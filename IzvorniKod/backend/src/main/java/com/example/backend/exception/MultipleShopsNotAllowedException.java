package com.example.backend.exception;

public class MultipleShopsNotAllowedException extends RuntimeException {
    public MultipleShopsNotAllowedException(String message) {
        super(message);
    }
}
