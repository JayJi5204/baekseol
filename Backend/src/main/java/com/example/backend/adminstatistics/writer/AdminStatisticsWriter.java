package com.example.backend.adminstatistics.writer;

import com.example.backend.adminstatistics.entity.DailyStatistics;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class AdminStatisticsWriter implements ItemWriter<DailyStatistics> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void write(Chunk<? extends DailyStatistics> chunk) throws Exception {
        String sql = """
    INSERT INTO daily_statistics 
    (stat_date, total_users, new_users, active_users, total_surveys, active_surveys, total_responses,
     daily_responses, total_points_issued, daily_points_issued, total_points_used, daily_points_used, 
     current_circulating_points, total_withdrawal_amount, daily_withdrawal_amount, daily_withdrawal_count,
     pending_withdrawal_count, failed_withdrawal_count, total_revenue, daily_revenue, total_payment_count,
     daily_payment_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        total_users = VALUES(total_users),
        new_users = VALUES(new_users),
        active_users = VALUES(active_users),
        total_surveys = VALUES(total_surveys),
        active_surveys = VALUES(active_surveys),
        total_responses = VALUES(total_responses),
        daily_responses = VALUES(daily_responses),
        total_points_issued = VALUES(total_points_issued),
        daily_points_issued = VALUES(daily_points_issued),
        total_points_used = VALUES(total_points_used),
        daily_points_used = VALUES(daily_points_used),
        current_circulating_points = VALUES(current_circulating_points),
        total_withdrawal_amount = VALUES(total_withdrawal_amount),
        daily_withdrawal_amount = VALUES(daily_withdrawal_amount),
        daily_withdrawal_count = VALUES(daily_withdrawal_count),
        pending_withdrawal_count = VALUES(pending_withdrawal_count),
        failed_withdrawal_count = VALUES(failed_withdrawal_count),
        total_revenue = VALUES(total_revenue),
        daily_revenue = VALUES(daily_revenue),
        total_payment_count = VALUES(total_payment_count),
        daily_payment_count = VALUES(daily_payment_count)
    """;


        for (DailyStatistics stats : chunk) {
            jdbcTemplate.update(sql,
                    stats.getStatDate(),
                    stats.getTotalUsers(),
                    stats.getNewUsers(),
                    stats.getActiveUsers(),
                    stats.getTotalSurveys(),
                    stats.getActiveSurveys(),
                    stats.getTotalResponses(),
                    stats.getDailyResponses(),
                    stats.getTotalPointsIssued(),
                    stats.getDailyPointsIssued(),
                    stats.getTotalPointsUsed(),
                    stats.getDailyPointsUsed(),
                    stats.getCurrentCirculatingPoints(),
                    stats.getTotalWithdrawalAmount(),
                    stats.getDailyWithdrawalAmount(),
                    stats.getDailyWithdrawalCount(),
                    stats.getPendingWithdrawalCount(),
                    stats.getFailedWithdrawalCount(),
                    stats.getTotalRevenue(),
                    stats.getDailyRevenue(),
                    stats.getTotalPaymentCount(),
                    stats.getDailyPaymentCount()
            );
        }
    }
}
