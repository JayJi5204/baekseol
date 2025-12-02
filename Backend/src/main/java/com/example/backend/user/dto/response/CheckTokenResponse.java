package com.example.backend.user.dto.response;

import lombok.Data;

@Data
public class CheckTokenResponse {
    private Long userId;
    private String message;
    private Boolean valid;

    public static CheckTokenResponse success(Long userId) {
        CheckTokenResponse response = new CheckTokenResponse();
        response.message = "유효한 토큰입니다.";
        response.userId=userId;
        response.valid=true;
        return response;
    }

    public static CheckTokenResponse fail() {
        CheckTokenResponse response = new CheckTokenResponse();
        response.message = "만료되었거나 유효하지 않은 토큰입니다.";
        response.valid=false;
        return response;
    }
}
