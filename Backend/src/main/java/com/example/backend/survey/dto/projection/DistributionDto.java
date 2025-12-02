package com.example.backend.survey.dto.projection;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/* 통계 분포용 아이템 */
@Data
@Builder
@AllArgsConstructor
public class DistributionDto {
    private String label;
    private Integer count;
}
