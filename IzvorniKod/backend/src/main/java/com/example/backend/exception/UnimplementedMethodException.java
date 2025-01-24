package com.example.backend.exception;

public class UnimplementedMethodException extends RuntimeException {
  public UnimplementedMethodException(String message) {
    super(message);
  }
}
