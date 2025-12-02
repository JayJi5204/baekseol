package com.example.backend.survey.dto.response;

import com.example.backend.interest.dto.response.InterestResDto;
import com.example.backend.survey.entity.Survey;
import com.example.backend.survey.enumType.SurveyState;

import java.time.LocalDateTime;

/* 설문 상세 페이지 이동 시, 참여자가 조회할 수 있는 정보 DTO */
public record SurveyDetailResDto(
        String title,
        String description,
        Long reward,
        Integer responseCnt,
        Integer maxResponse,
        Integer questionCnt,
        SurveyState state,
        LocalDateTime deadline,
        InterestResDto interest
) {
    public static SurveyDetailResDto from(Survey survey) {
        return new SurveyDetailResDto(
                survey.getTitle(),
                survey.getDescription(),
                survey.getReward(),
                survey.getResponseCnt(),
                survey.getMaxResponse(),
                survey.getQuestionCnt(),
                survey.getState(),
                survey.getDeadline(),
                InterestResDto.from(survey.getInterest())
        );
    }
}
