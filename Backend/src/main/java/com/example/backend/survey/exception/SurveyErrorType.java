package com.example.backend.survey.exception;

import com.example.backend.global.exception.type.ErrorType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum SurveyErrorType implements ErrorType {
    ERROR_CREATE_SURVEY(HttpStatus.BAD_REQUEST, "설문조사 생성 실패"),
    ERROR_GET_SURVEY(HttpStatus.NO_CONTENT, "단일 설문 조회 실패"),
    ERROR_GET_SURVEY_LIST(HttpStatus.NO_CONTENT, "설문 목록 조회 실패"),
    ERROR_CLOSE_SURVEY(HttpStatus.BAD_REQUEST, "설문 내리기 실패"),
    ERROR_CLOSE_SURVEY_NOT_PERMISSION(HttpStatus.FORBIDDEN, "설문 내리기 권한 없음"),
    ERROR_CLOSE_SURVEY_ALREADY_DONE(HttpStatus.ALREADY_REPORTED, "이미 종료된 설문"),
    ERROR_PARTICIPATE_SURVEY_USER_NOT_FOUND(HttpStatus.FORBIDDEN, "참여 유저 조회 실패"),
    ERROR_PARTICIPATE_SURVEY_ALREADY_DONE(HttpStatus.ALREADY_REPORTED, "이미 참여한 설문"),
    ERROR_PARTICIPATE_SURVEY_CLOSED(HttpStatus.BAD_REQUEST, "종료된 설문"),
    ERROR_PARTICIPATE_SURVEY_NO_CONTENT(HttpStatus.NO_CONTENT, "참여 설문 조회 실패"),
    ERROR_GET_STATISTICS_NOT_PERMISSION(HttpStatus.FORBIDDEN, "통계 조회 권한 없음"),
    ERROR_GET_STATISTICS_NO_CONTENT(HttpStatus.NO_CONTENT, "설문 조회 실패"),
    ERROR_GET_STATISTICS_QUESTION_TYPE_MISMATCH(HttpStatus.BAD_REQUEST, "질문 타입 불일치"),
    ERROR_PATCH_SURVEY_TO_DONE(HttpStatus.BAD_REQUEST, "설문 마감 작업 실패");

    private final HttpStatus httpStatus;
    private final String message;

    @Override
    public int getHttpStatusCode() {
        return httpStatus.value();
    }
}
