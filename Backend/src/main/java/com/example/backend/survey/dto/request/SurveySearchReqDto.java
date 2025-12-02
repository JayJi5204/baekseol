package com.example.backend.survey.dto.request;

import com.example.backend.survey.enumType.SortType;

/* 설문 검색 조건 DTO */
public record SurveySearchReqDto(
        String title,
        Long interestId,
        SortType sortType
) {
    public static SurveySearchReqDto of(String title, Long interestId, SortType sortType) {
        return new SurveySearchReqDto(title, interestId, sortType);
    }

    public boolean hasTitle() {
        return title != null && !title.isBlank();
    }
}
