package com.example.backend.adminstatistics.reader;

import com.example.backend.adminstatistics.dto.DailyStatisticsDTO;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@StepScope
public class AdminStatisticsReader implements ItemReader<DailyStatisticsDTO> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private boolean isRead = false;

    @Override
    public DailyStatisticsDTO read() throws Exception {
        // 한 번만 읽도록 제어 (통계는 보통 하루 한 번)
        if (isRead) {
            return null; // null 반환 시 Reader 종료
        }

        isRead = true;

        // 모든 통계를 SQL로 한 번에 집계
        String sql = """
    SELECT 
        DATE_SUB(CURDATE(), INTERVAL 1 DAY) as stat_date,
        
        -- 사용자 관련
        (SELECT COUNT(*) FROM users WHERE is_deleted = false) as total_users,
        (SELECT COUNT(*) FROM users WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND is_deleted = false) as new_users,
        (SELECT COUNT(DISTINCT user_id) FROM point_record WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)) as active_users,
        
        -- 설문 관련
        (SELECT COUNT(*) FROM surveys) as total_surveys,
        (SELECT COUNT(*) FROM surveys WHERE state = 'IN_PROCESS') as active_surveys,
        (SELECT COUNT(*) FROM user_surveys) as total_responses,
        (SELECT COUNT(*) FROM user_surveys WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)) as daily_responses,
        
        
        -- 포인트 관련
        (SELECT COALESCE(SUM(amount), 0) FROM point_record WHERE type = 'GET') as total_points_issued,
        (SELECT COALESCE(SUM(amount), 0) FROM point_record WHERE type = 'GET' AND DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)) as daily_points_issued,
        (SELECT COALESCE(SUM(amount), 0) FROM point_record WHERE type = 'USE') as total_points_used,
        (SELECT COALESCE(SUM(amount), 0) FROM point_record WHERE type = 'USE' AND DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)) as daily_points_used,
        (SELECT COALESCE(SUM(point), 0) FROM users WHERE is_deleted = false) as current_circulating_points,
        
        -- 환급 관련
        (SELECT COALESCE(SUM(amount), 0) FROM withdrawal_requests WHERE status = 'COMPLETED') as total_withdrawal_amount,
        (SELECT COALESCE(SUM(amount), 0) FROM withdrawal_requests WHERE status = 'COMPLETED' AND DATE(completed_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)) as daily_withdrawal_amount,
        (SELECT COUNT(*) FROM withdrawal_requests WHERE status = 'COMPLETED' AND DATE(completed_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)) as daily_withdrawal_count,
        (SELECT COUNT(*) FROM withdrawal_requests WHERE status = 'PENDING') as pending_withdrawal_count,
        (SELECT COUNT(*) FROM withdrawal_requests WHERE status = 'FAILED') as failed_withdrawal_count,
        
        -- 결제 관련
        (SELECT COUNT(*) FROM payments WHERE status = 'CONFIRMED') as total_payment_count,
        (SELECT COUNT(*) FROM payments WHERE status = 'CONFIRMED' AND DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)) as daily_payment_count,
        (SELECT COALESCE(SUM(platform_fee), 0) FROM point_record WHERE platform_fee IS NOT NULL) as total_revenue,
        (SELECT COALESCE(SUM(platform_fee), 0) FROM point_record WHERE platform_fee IS NOT NULL AND DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)) as daily_revenue
    """;


        return jdbcTemplate.queryForObject(sql, (rs, rowNum) ->
                DailyStatisticsDTO.builder()
                        .statDate(rs.getDate("stat_date").toLocalDate())
                        // 사용자
                        .totalUsers(rs.getLong("total_users"))
                        .newUsers(rs.getLong("new_users"))
                        .activeUsers(rs.getLong("active_users"))
                        // 설문
                        .totalSurveys(rs.getLong("total_surveys"))
                        .activeSurveys(rs.getLong("active_surveys"))
                        .totalResponses(rs.getLong("total_responses"))
                        .dailyResponses(rs.getLong("daily_responses"))
                        // 포인트
                        .totalPointsIssued(rs.getLong("total_points_issued"))
                        .dailyPointsIssued(rs.getLong("daily_points_issued"))
                        .totalPointsUsed(rs.getLong("total_points_used"))
                        .dailyPointsUsed(rs.getLong("daily_points_used"))
                        .currentCirculatingPoints(rs.getLong("current_circulating_points"))
                        // 환급
                        .totalWithdrawalAmount(rs.getLong("total_withdrawal_amount"))
                        .dailyWithdrawalAmount(rs.getLong("daily_withdrawal_amount"))
                        .dailyWithdrawalCount(rs.getLong("daily_withdrawal_count"))
                        .pendingWithdrawalCount(rs.getLong("pending_withdrawal_count"))
                        .failedWithdrawalCount(rs.getLong("failed_withdrawal_count"))
                        // 결제
                        .totalRevenue(rs.getLong("total_revenue"))
                        .dailyRevenue(rs.getLong("daily_revenue"))
                        .totalPaymentCount(rs.getLong("total_payment_count"))
                        .dailyPaymentCount(rs.getLong("daily_payment_count"))
                        .build()
        );
    }
}
