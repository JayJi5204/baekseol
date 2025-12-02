package com.example.backend.adminstatistics.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_statistics",
        uniqueConstraints = @UniqueConstraint(columnNames = "stat_date"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stat_date", nullable = false, unique = true)
    private LocalDate statDate;

    @Column(name = "total_users")
    private Long totalUsers;

    @Column(name = "new_users")
    private Long newUsers;

    @Column(name = "active_users")
    private Long activeUsers;

    @Column(name = "total_surveys")
    private Long totalSurveys;

    @Column(name = "active_surveys")
    private Long activeSurveys;

    @Column(name = "total_responses")
    private Long totalResponses;

    @Column(name = "daily_responses")
    private Long dailyResponses;

    @Column(name = "total_points_issued")
    private Long totalPointsIssued;

    @Column(name = "daily_points_issued")
    private Long dailyPointsIssued;

    @Column(name = "total_points_used")
    private Long totalPointsUsed;

    @Column(name = "daily_points_used")
    private Long dailyPointsUsed;

    @Column(name = "current_circulating_points")
    private Long currentCirculatingPoints;

    @Column(name = "total_withdrawal_amount")
    private Long totalWithdrawalAmount;

    @Column(name = "daily_withdrawal_amount")
    private Long dailyWithdrawalAmount;

    @Column(name = "daily_withdrawal_count")
    private Long dailyWithdrawalCount;

    @Column(name = "pending_withdrawal_count")
    private Long pendingWithdrawalCount;

    @Column(name = "failed_withdrawal_count")
    private Long failedWithdrawalCount;

    @Column(name = "total_revenue")
    private Long totalRevenue;

    @Column(name = "daily_revenue")
    private Long dailyRevenue;

    @Column(name = "total_payment_count")
    private Long totalPaymentCount;

    @Column(name = "daily_payment_count")
    private Long dailyPaymentCount;

}
