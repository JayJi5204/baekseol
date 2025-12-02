package com.example.backend.adminstatistics.exception;

import com.example.backend.global.exception.type.ErrorType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum AdminStatisticsErrorType implements ErrorType {

    ERROR_STATISTICS_NOT_FOUND(HttpStatus.NOT_FOUND, "통계 정보를 찾을 수 없습니다."),
    ERROR_STATISTICS_INVALID_DATE(HttpStatus.BAD_REQUEST, "유효하지 않은 날짜입니다."),
    ERROR_UNAUTHORIZED_ACCESS(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    ERROR_STATISTICS_INVALID_INTERVAL(HttpStatus.BAD_REQUEST, "유효하지 않은 기간 구분입니다."),
    ;

    private final HttpStatus httpStatus;
    private final String message;

    @Override
    public int getHttpStatusCode() {
        return httpStatus.value();
    }
}
