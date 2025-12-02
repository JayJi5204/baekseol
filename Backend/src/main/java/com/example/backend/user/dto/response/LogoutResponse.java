package com.example.backend.user.dto.response;

import lombok.Data;

@Data
public class LogoutResponse {
    String message;

    public static LogoutResponse from(Long userId){
        LogoutResponse response=new LogoutResponse();
        response.message="userId : "+userId + " 로그아웃 성공";
        return  response;
    }
}
