package com.example.backend.exception;

public class ShopDoesntBelongToGivenOwnerException extends RuntimeException {
    public ShopDoesntBelongToGivenOwnerException(String message) {
        super(message);
    }
}
