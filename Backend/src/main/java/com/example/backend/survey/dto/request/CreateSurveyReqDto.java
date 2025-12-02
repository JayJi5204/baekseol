package com.example.backend.survey.dto.request;

import java.time.LocalDateTime;
import java.util.List;

/* 설문 생성 DTO */
public record CreateSurveyReqDto(
        String title,
        String description,
        Integer maxResponse,
        Long reward,
        LocalDateTime deadline,
        Long interestId,
        List<QuestionReqDto> questions
) {
    public static CreateSurveyReqDto of(String title, String description, Integer maxResponse, Long reward, LocalDateTime deadline, Long interestId, List<QuestionReqDto> questions) {
        return new CreateSurveyReqDto(title, description, maxResponse, reward, deadline, interestId, questions);
    }
}
