package com.example.backend.survey.dto.response;

import java.util.List;

/* 질문별 응답 통계 DTO */
public record QuestionStatisticsResDto(
        Integer number,
        String content,
        List<ChoiceStatisticsResDto> choiceStatistics,
        List<String> subjectStatistics
) {
    public static QuestionStatisticsResDto ofSelective(Integer number, String content, List<ChoiceStatisticsResDto> choiceStatistics) {
        return new QuestionStatisticsResDto(number, content, choiceStatistics, null);
    }

    public static QuestionStatisticsResDto ofSubjective(Integer number, String content, List<String> subjectStatistics) {
        return new QuestionStatisticsResDto(number, content, null, subjectStatistics);
    }
}
