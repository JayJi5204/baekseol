// point/exception/PointSuccessType.java
package com.example.backend.point.exception;

import com.example.backend.global.exception.type.SuccessType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum PointSuccessType implements SuccessType {
    // 조회
    SUCCESS_INQUIRY_POINT_HISTORY(HttpStatus.OK, "포인트 내역 조회 성공"),
    SUCCESS_INQUIRY_POINT_BALANCE(HttpStatus.OK, "포인트 잔액 조회 성공");

    private final HttpStatus httpStatus;
    private final String message;

    @Override
    public int getHttpStatusCode() {
        return httpStatus.value();
    }
}
