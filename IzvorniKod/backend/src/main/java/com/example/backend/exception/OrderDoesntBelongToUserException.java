package com.example.backend.exception;

public class OrderDoesntBelongToUserException extends RuntimeException {
    public OrderDoesntBelongToUserException(String message) {
        super(message);
    }
}
