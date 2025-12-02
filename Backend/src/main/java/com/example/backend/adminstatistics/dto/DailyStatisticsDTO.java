package com.example.backend.adminstatistics.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyStatisticsDTO {
    private LocalDate statDate;
    private Long totalUsers;
    private Long newUsers;
    private Long activeUsers;
    private Long totalSurveys;
    private Long activeSurveys;
    private Long totalResponses;
    private Long dailyResponses;
    private Long totalPointsIssued;
    private Long dailyPointsIssued;
    private Long totalPointsUsed;
    private Long dailyPointsUsed;
    private Long currentCirculatingPoints;
    private Long totalWithdrawalAmount;
    private Long dailyWithdrawalAmount;
    private Long dailyWithdrawalCount;
    private Long pendingWithdrawalCount;
    private Long failedWithdrawalCount;
    private Long totalRevenue;
    private Long dailyRevenue;
    private Long totalPaymentCount;
    private Long dailyPaymentCount;
}

