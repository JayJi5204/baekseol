package com.example.backend.survey.dto.response;

/* 선택지별 통계 DTO */
public record ChoiceStatisticsResDto(
        Integer number,
        String content,
        Long count
) {
    public static ChoiceStatisticsResDto of(Integer number, String content, Long count) {
        return new ChoiceStatisticsResDto(number, content, count);
    }
}
