package com.example.backend.user.dto.response;

import lombok.Data;

@Data
public class RefreshTokenResponse {

    private String accessToken;

    public static RefreshTokenResponse from(String token) {
        RefreshTokenResponse response = new RefreshTokenResponse();
        response.accessToken = token;
        return response;
    }
}
