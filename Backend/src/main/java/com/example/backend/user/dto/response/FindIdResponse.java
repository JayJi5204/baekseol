package com.example.backend.user.dto.response;

import com.example.backend.user.entity.UserEntity;
import lombok.Data;

@Data
public class FindIdResponse {

    private String maskedUsername;

    public static FindIdResponse from(UserEntity entity) {
        FindIdResponse response = new FindIdResponse();
        String username = entity.getUsername();

        response.maskedUsername = username.substring(0, username.length() - 4) + "****";

        return response;
    }
}
