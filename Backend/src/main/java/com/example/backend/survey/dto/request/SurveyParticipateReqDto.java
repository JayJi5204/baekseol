package com.example.backend.survey.dto.request;

import java.util.List;

/* 설문 참여 요청 DTO */
public record SurveyParticipateReqDto(
        List<AnswerReqDto> answers
) {
    public static SurveyParticipateReqDto from(List<AnswerReqDto> answers) {
        return new SurveyParticipateReqDto(answers);
    }
}
