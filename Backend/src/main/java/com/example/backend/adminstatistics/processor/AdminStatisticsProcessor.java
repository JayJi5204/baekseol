package com.example.backend.adminstatistics.processor;

import com.example.backend.adminstatistics.dto.DailyStatisticsDTO;
import com.example.backend.adminstatistics.entity.DailyStatistics;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

@Component
public class AdminStatisticsProcessor implements ItemProcessor<DailyStatisticsDTO, DailyStatistics> {

    @Override
    public DailyStatistics process(DailyStatisticsDTO dto) throws Exception {
        // DTO → Entity 변환
        return DailyStatistics.builder()
                .statDate(dto.getStatDate())
                // 사용자 관련
                .totalUsers(dto.getTotalUsers())
                .newUsers(dto.getNewUsers())
                .activeUsers(dto.getActiveUsers())
                // 설문 관련
                .totalSurveys(dto.getTotalSurveys())
                .activeSurveys(dto.getActiveSurveys())
                .totalResponses(dto.getTotalResponses())
                .dailyResponses(dto.getDailyResponses())
                // 포인트 관련
                .totalPointsIssued(dto.getTotalPointsIssued())
                .dailyPointsIssued(dto.getDailyPointsIssued())
                .totalPointsUsed(dto.getTotalPointsUsed())
                .dailyPointsUsed(dto.getDailyPointsUsed())
                .currentCirculatingPoints(dto.getCurrentCirculatingPoints())
                // 환급 관련
                .totalWithdrawalAmount(dto.getTotalWithdrawalAmount())
                .dailyWithdrawalAmount(dto.getDailyWithdrawalAmount())
                .dailyWithdrawalCount(dto.getDailyWithdrawalCount())
                .pendingWithdrawalCount(dto.getPendingWithdrawalCount())
                .failedWithdrawalCount(dto.getFailedWithdrawalCount())
                // 결제 관련
                .totalRevenue(dto.getTotalRevenue())
                .dailyRevenue(dto.getDailyRevenue())
                .totalPaymentCount(dto.getTotalPaymentCount())
                .dailyPaymentCount(dto.getDailyPaymentCount())
                // createdAt, updatedAt은 BaseTimeEntity가 자동 설정
                .build();
    }
}
