package com.example.backend.survey.dto.request;

import com.example.backend.global.enumType.AgeGroup;
import com.example.backend.global.enumType.WorkType;
import com.example.backend.user.enumType.Gender;
import jakarta.annotation.Nullable;

public record SubjectiveStatisticsReqDto(
        @Nullable WorkType workType,
        AgeGroup ageGroup,
        Gender gender
) {
    public static SubjectiveStatisticsReqDto of(WorkType workType, AgeGroup ageGroup, Gender gender) {
        return new SubjectiveStatisticsReqDto(workType, ageGroup, gender);
    }
}
