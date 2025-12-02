package com.example.backend.adminstatistics.exception;

import com.example.backend.global.exception.type.SuccessType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum AdminStatisticsSuccessType implements SuccessType {

    SUCCESS_GET_STATISTICS(HttpStatus.OK, "통계 정보 조회에 성공했습니다."),

    ;

    private final HttpStatus httpStatus;
    private final String message;

    @Override
    public int getHttpStatusCode() {
        return httpStatus.value();
    }
}
