package com.example.backend.global.enumType;

import lombok.Getter;

@Getter
public enum AgeGroup {
    TEEN("10대", 10, 19),
    TWENTIES("20대", 20, 29),
    THIRTIES("30대", 30, 39),
    FORTIES("40대", 40, 49),
    FIFTIES("50대", 50, 59),
    SIXTY_PLUS("60대 이상", 60, 999);

    private final String description;
    private final Integer minAge;
    private final Integer maxAge;

    AgeGroup(String description, Integer minAge, Integer maxAge) {
        this.description = description;
        this.minAge = minAge;
        this.maxAge = maxAge;
    }

    public static AgeGroup fromAge(Long age) {
        if (age == null) return null;
        for (AgeGroup ageGroup : values()) {
            if (age >= ageGroup.minAge && age <= ageGroup.maxAge) return ageGroup;
        }
        return SIXTY_PLUS;
    }
}
