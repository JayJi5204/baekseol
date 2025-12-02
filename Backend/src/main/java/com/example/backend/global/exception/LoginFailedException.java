package com.example.backend.global.exception;

import lombok.Getter;

@Getter
public class LoginFailedException extends RuntimeException {
    private final String fieldName;

    public LoginFailedException(String fieldName, String message) {
        super(message);
        this.fieldName = fieldName;
    }
}
