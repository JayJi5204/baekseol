package com.example.backend.survey.dto.response;

import java.util.List;

/* 설문 목록 DTO */
public record SurveyListResDto(
        List<SurveyItemResDto> surveyItems
) {
    public static SurveyListResDto from(List<SurveyItemResDto> surveyItems) {
        return new SurveyListResDto(surveyItems);
    }
}
