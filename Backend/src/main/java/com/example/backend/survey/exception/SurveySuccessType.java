package com.example.backend.survey.exception;

import com.example.backend.global.exception.type.SuccessType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum SurveySuccessType implements SuccessType {
    SUCCESS_CREATE_SURVEY(HttpStatus.CREATED, "설문조사 생성 성공"),
    SUCCESS_GET_SURVEY(HttpStatus.OK, "단일 설문 조회 성공"),
    SUCCESS_GET_SURVEY_LIST(HttpStatus.OK, "설문 목록 조회 성공"),
    SUCCESS_GET_QUESTIONS(HttpStatus.OK, "질문 목록 조회 성공"),
    SUCCESS_GET_SURVEY_RECOMMEND(HttpStatus.OK, "설문 추천 받기 성공"),
    SUCCESS_CLOSE_SURVEY(HttpStatus.NO_CONTENT, "설문 내리기 성공"),
    SUCCESS_RESPOND_SURVEY(HttpStatus.CREATED, "설문 참여 성공"),
    SUCCESS_GET_STATISTICS_PARTICIPANTS(HttpStatus.OK, "참여자 통계 조회 성공"),
    SUCCESS_GET_STATISTICS_ANSWER(HttpStatus.OK, "응답 통계 조회 성공"),
    SUCCESS_GET_STATISTICS_PARTICIPANTS_BY_QUESTION(HttpStatus.OK, "질문별 참여자 응답 통계 조회 성공"),
    SUCCESS_GET_PARTICIPATE_YN(HttpStatus.OK, "참여 여부 조회 성공"),
    SUCCESS_GET_ANSWERS_FOR_CONDITION(HttpStatus.OK, "주관식 응답 조회 성공");

    private final HttpStatus httpStatus;
    private final String message;

    @Override
    public int getHttpStatusCode() {
        return httpStatus.value();
    }
}
