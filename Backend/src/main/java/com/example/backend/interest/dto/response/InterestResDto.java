package com.example.backend.interest.dto.response;

import com.example.backend.interest.entity.Interest;

public record InterestResDto(
        Long interestId,
        String content
) {
    public static InterestResDto from(Interest interest) {
        return new InterestResDto(
                interest.getInterestId(),
                interest.getContent()
        );
    }

    public static InterestResDto of(Long interestId, String content) {
        return new InterestResDto(interestId, content);
    }
}