package com.example.backend.survey.dto.request;

/* 설문 생성 시, 선택지 DTO */
public record ChoiceReqDto(
        Integer number,
        String content
) {
    public static ChoiceReqDto of(Integer number, String content) {
        return new ChoiceReqDto(number, content);
    }
}
