package com.example.backend.interest.exception;

import com.example.backend.global.exception.type.ErrorType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum InterestErrorType implements ErrorType {
    ERROR_GET_INTEREST(HttpStatus.NO_CONTENT, "관심사 조회 실패"),
    ERROR_GET_INTEREST_NO_PARTICIPATED(HttpStatus.BAD_REQUEST, "설문 참여 이력 없음");

    private final HttpStatus httpStatus;
    private final String message;

    @Override
    public int getHttpStatusCode() {
        return httpStatus.value();
    }
}
