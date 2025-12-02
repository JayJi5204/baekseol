package com.example.backend.user.dto.response;

import com.example.backend.user.entity.UserEntity;
import lombok.Data;

@Data
public class LoginResponse {

    private Long id;
    private String username;
    private String accessToken;

    public static LoginResponse from(UserEntity entity, String token) {
        LoginResponse response = new LoginResponse();
        response.id = entity.getId();
        response.username = entity.getUsername();
        response.accessToken = token;
        return response;
    }
}
