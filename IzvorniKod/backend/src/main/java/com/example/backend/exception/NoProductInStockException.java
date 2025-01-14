package com.example.backend.exception;

public class NoProductInStockException extends RuntimeException {
    public NoProductInStockException(String message) {
        super(message);
    }
}
