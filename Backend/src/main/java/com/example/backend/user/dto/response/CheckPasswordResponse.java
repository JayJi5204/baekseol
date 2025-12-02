package com.example.backend.user.dto.response;

import lombok.Data;

@Data
public class CheckPasswordResponse {
    private Boolean trueOrFalse;
    private String message;

    public static CheckPasswordResponse success() {
        CheckPasswordResponse response = new CheckPasswordResponse();
        response.trueOrFalse=true;
        response.message = "success";
        return response;
    }

    public static CheckPasswordResponse fail(String message) {
        CheckPasswordResponse response = new CheckPasswordResponse();
        response.trueOrFalse=false;
        response.message = message;
        return response;
    }
}
