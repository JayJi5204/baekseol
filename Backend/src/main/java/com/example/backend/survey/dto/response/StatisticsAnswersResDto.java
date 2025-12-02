package com.example.backend.survey.dto.response;

import java.util.List;

/* 객관식 통계 DTO */
public record StatisticsAnswersResDto(
        List<QuestionStatisticsResDto> questionStatistics
) {
    public static StatisticsAnswersResDto from(List<QuestionStatisticsResDto> questionStatistics) {
        return new StatisticsAnswersResDto(questionStatistics);
    }
}
