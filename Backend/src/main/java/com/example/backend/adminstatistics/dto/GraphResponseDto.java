package com.example.backend.adminstatistics.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class GraphResponseDto {
    private String interval; // daily, weekly, monthly
    private List<String> labels; // 날짜/주/월 라벨 배열 (예: ["2025-11-08", "2025-11-09", ...])
    private List<Long> newUsersSeries;
    private List<Long> activeUsersSeries;
    private List<Long> pointsIssuedSeries;
    private List<Long> pointsUsedSeries;
    private List<Long> revenueSeries;
}
