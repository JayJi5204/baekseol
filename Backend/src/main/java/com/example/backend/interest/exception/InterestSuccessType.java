package com.example.backend.interest.exception;

import com.example.backend.global.exception.type.SuccessType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum InterestSuccessType implements SuccessType {
    SUCCESS_GET_INTEREST(HttpStatus.OK, "관심사 조회 성공"),
    SUCCESS_GET_MY_INTEREST(HttpStatus.OK, "나의 관심사 조회 성공");

    private final HttpStatus httpStatus;
    private final String message;

    @Override
    public int getHttpStatusCode() {
        return httpStatus.value();
    }
}
