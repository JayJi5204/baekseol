package com.example.backend.survey.dto.response;

import com.example.backend.survey.entity.Choice;

/* 선택지 DTO */
public record ChoiceResDto(
        Integer number,
        String content
) {
    public static ChoiceResDto of(Integer number, String content) {
        return new ChoiceResDto(number, content);
    }

    public static ChoiceResDto from(Choice choice) {
        return new ChoiceResDto(choice.getNumber(), choice.getContent());
    }
}
