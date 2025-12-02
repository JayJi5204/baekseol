package com.example.backend.user.dto.response;

import com.example.backend.user.entity.UserEntity;
import lombok.Data;

@Data
public class SendMailResponse {
    private String token;
    private Boolean trueOrFalse;
    private String message;


    public static SendMailResponse success(UserEntity entity, String token) {
        SendMailResponse response = new SendMailResponse();
        response.token=token;
        response.trueOrFalse=true;
        response.message = entity.getEmail() + "으로 메일을 발송하였습니다.";
        return response;
    }

    public static SendMailResponse countFail() {
        SendMailResponse response = new SendMailResponse();
        response.trueOrFalse=false;
        response.message = "비밀번호 찾기 한도에 도달하였습니다. \n 24시간후에 다시 시도해주세요.";
        return response;
    }
    public static SendMailResponse userFail() {
        SendMailResponse response = new SendMailResponse();
        response.trueOrFalse=false;
        response.message = "입력하신 정보가 올바르지 않습니다.";
        return response;
    }

}
