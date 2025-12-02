package com.example.backend.user.dto.response;

import com.example.backend.user.entity.UserEntity;
import lombok.Data;

@Data
public class FindPasswordResponse {

    private String message;

    public static FindPasswordResponse from(UserEntity entity) {
        FindPasswordResponse response = new FindPasswordResponse();
        response.message = entity.getUsername() + "의 비밀번호가 변경되었습니다.";
        return response;
    }

}
