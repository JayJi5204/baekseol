package com.example.backend.survey.dto.response;

import com.example.backend.survey.entity.Survey;
import com.example.backend.survey.enumType.SurveyState;

import java.time.LocalDateTime;
import java.util.List;

/* 설문 개별 조회 DTO (참여) */
public record SurveyResDto(
        String title,
        String description,
        Integer maxResponse,
        Long reward,
        LocalDateTime deadline,
        SurveyState state,
        Integer responseCnt,
        List<QuestionResDto> questions
) {
    public static SurveyResDto from(Survey survey) {
        return new SurveyResDto(
                survey.getTitle(),
                survey.getDescription(),
                survey.getMaxResponse(),
                survey.getReward(),
                survey.getDeadline(),
                survey.getState(),
                survey.getResponseCnt(),
                survey.getQuestions().stream()
                        .map(QuestionResDto::from)
                        .toList()
        );
    }
}
