package com.example.backend.survey.dto.response;

import com.example.backend.survey.entity.Survey;
import com.example.backend.survey.enumType.SurveyState;

import java.time.LocalDateTime;

/* 설문 목록 조회 시, 목록의 아이템에 보여질 정보 */
public record SurveyItemResDto(
        Long surveyId,
        String title,
        Integer responseCnt,
        Integer maxResponse,
        Long reward,
        SurveyState state,
        LocalDateTime createdAt,
        LocalDateTime deadline
) {
    public static SurveyItemResDto from(Survey survey) {
        return new SurveyItemResDto(
                survey.getSurveyId(),
                survey.getTitle(),
                survey.getResponseCnt(),
                survey.getMaxResponse(),
                survey.getReward(),
                survey.getState(),
                survey.getCreatedAt(),
                survey.getDeadline()
        );
    }
}
