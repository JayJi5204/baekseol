package com.example.backend.global.exception.type;

public interface ErrorType {
    int getHttpStatusCode();

    String getMessage();
}
