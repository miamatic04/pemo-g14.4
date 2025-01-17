package com.example.backend.exception;

public class IllegalReportFormatException extends RuntimeException {
    public IllegalReportFormatException(String message) {
        super(message);
    }
}
