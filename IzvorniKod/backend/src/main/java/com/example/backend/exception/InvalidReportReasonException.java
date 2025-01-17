package com.example.backend.exception;

public class InvalidReportReasonException extends RuntimeException {
    public InvalidReportReasonException(String message) {
        super(message);
    }
}
