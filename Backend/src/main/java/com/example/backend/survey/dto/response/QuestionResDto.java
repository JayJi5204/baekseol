package com.example.backend.survey.dto.response;

import com.example.backend.survey.entity.Question;
import com.example.backend.survey.enumType.QuestionType;

import java.util.List;

/* 질문 DTO */
public record QuestionResDto(
        Integer number,
        String content,
        QuestionType type,
        List<ChoiceResDto> choices
) {
    public static QuestionResDto of(Integer number, String content, QuestionType type, List<ChoiceResDto> choices) {
        return new QuestionResDto(number, content, type, choices);
    }

    public static QuestionResDto from(Question question) {
        return new QuestionResDto(
                question.getNumber(),
                question.getContent(),
                question.getType(),
                question.getChoices().stream().map(ChoiceResDto::from).toList()
        );
    }
}
