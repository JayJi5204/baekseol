package com.example.backend.survey.dto.request;

import com.example.backend.survey.enumType.QuestionType;

import java.util.List;

/* 질문별 응답 DTO */
public record AnswerReqDto(
        Integer number,
        QuestionType questionType,
        String content,
        List<Integer> answerChoices
) {
    public static AnswerReqDto of(Integer number, QuestionType questionType, String content, List<Integer> answerChoices) {
        return new AnswerReqDto(number, questionType, content, answerChoices);
    }
}
