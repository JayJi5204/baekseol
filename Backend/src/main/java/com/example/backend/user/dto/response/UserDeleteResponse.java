package com.example.backend.user.dto.response;

import com.example.backend.user.entity.UserEntity;
import lombok.Data;

@Data
public class UserDeleteResponse {
    private Long id;
    private String username;
    private Boolean isDeleted;
    private String message;

    public static UserDeleteResponse from(UserEntity entity) {
        UserDeleteResponse response = new UserDeleteResponse();
        response.id = entity.getId();
        response.username = entity.getUsername();
        response.isDeleted=entity.getIsDeleted();
        response.message = "회원 탈퇴가 완료되었습니다.";
        return response;
    }
}