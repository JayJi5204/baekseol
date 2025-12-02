package com.example.backend.survey.dto.request;

import com.example.backend.survey.enumType.QuestionType;

import java.util.List;

/* 설문 생성 시, 질문 DTO */
public record QuestionReqDto(
        Integer number,
        String content,
        QuestionType type,
        List<ChoiceReqDto> choices
) {
    public static QuestionReqDto of(Integer number, String content, QuestionType type, List<ChoiceReqDto> choices) {
        return new QuestionReqDto(number, content, type, choices);
    }
}
