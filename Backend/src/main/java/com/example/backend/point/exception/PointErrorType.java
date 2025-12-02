package com.example.backend.point.exception;

import com.example.backend.global.exception.type.ErrorType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum PointErrorType implements ErrorType {
    ERROR_USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다"),
    ERROR_INSUFFICIENT_POINTS(HttpStatus.BAD_REQUEST, "포인트가 부족합니다"),
    ERROR_CHARGE_POINTS_FAILED(HttpStatus.BAD_REQUEST, "포인트 충전 실패"),
    ERROR_USE_POINTS_FAILED(HttpStatus.BAD_REQUEST, "포인트 사용 실패"),
    ERROR_INVALID_AMOUNT(HttpStatus.BAD_REQUEST, "유효하지 않은 금액입니다"),
    ERROR_INVALID_SURVEY_STATE(HttpStatus.BAD_REQUEST, "환불 가능한 설문 상태가 아닙니다"),
    ERROR_NOT_SURVEY_OWNER(HttpStatus.BAD_REQUEST, "설문 등록자가 아닙니다"),
    ERROR_SURVEY_NO_REGISTRATION_POINTS(HttpStatus.BAD_REQUEST, "설문 등록 포인트 내역이 존재하지 않습니다"),
    ERROR_NO_REFUND_AVAILABLE(HttpStatus.BAD_REQUEST, "환불 가능한 포인트가 없습니다");

    private final HttpStatus httpStatus;
    private final String message;

    @Override
    public int getHttpStatusCode() {
        return httpStatus.value();
    }
}
