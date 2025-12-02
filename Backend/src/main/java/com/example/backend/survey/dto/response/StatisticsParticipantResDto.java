package com.example.backend.survey.dto.response;

import com.example.backend.survey.dto.projection.DistributionDto;
import lombok.Builder;

import java.util.List;

/* 응답자 통계 DTO */
@Builder
public record StatisticsParticipantResDto(
        Integer responseCnt,
        Integer maxResponse,
        List<DistributionDto> genderDistribution,
        List<DistributionDto> ageDistribution,
        List<DistributionDto> workDistribution
) {
    public static StatisticsParticipantResDto of(Integer responseCnt, Integer maxResponse, List<DistributionDto> genderDistribution, List<DistributionDto> ageDistribution, List<DistributionDto> workDistribution) {
        return new StatisticsParticipantResDto(responseCnt, maxResponse, genderDistribution, ageDistribution, workDistribution);
    }
}
