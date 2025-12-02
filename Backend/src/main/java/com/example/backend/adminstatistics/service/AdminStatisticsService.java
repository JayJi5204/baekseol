package com.example.backend.adminstatistics.service;

import com.example.backend.adminstatistics.dto.*;
import com.example.backend.adminstatistics.entity.DailyStatistics;
import com.example.backend.adminstatistics.exception.AdminStatisticsErrorType;
import com.example.backend.adminstatistics.repository.DailyStatisticsRepository;
import com.example.backend.global.exception.CustomException;
import com.example.backend.payment.enumType.TransactionStatus;
import com.example.backend.payment.repository.PaymentRepository;
import com.example.backend.payment.repository.WithdrawalRequestRepository;
import com.example.backend.point.entity.PointRecord;
import com.example.backend.point.enumType.PointType;
import com.example.backend.point.enumType.ReferenceType;
import com.example.backend.point.repository.PointRecordRepository;
import com.example.backend.survey.enumType.SurveyState;
import com.example.backend.survey.repository.SurveyRepository;
import com.example.backend.survey.repository.UserSurveyRepository;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminStatisticsService {

    private final DailyStatisticsRepository dailyStatisticsRepository;
    private final UserRepository userRepository;
    private final SurveyRepository surveyRepository;
    private final PointRecordRepository pointRecordRepository;
    private final PaymentRepository paymentRepository;
    private final WithdrawalRequestRepository withdrawalRequestRepository;
    private final UserSurveyRepository userSurveyRepository;

    // ==================== 기존 일별 통계 ====================

    public DailyStatisticsDTO getStatisticsByDate(LocalDate statDate) {
        if (statDate == null) {
            throw new CustomException(AdminStatisticsErrorType.ERROR_STATISTICS_INVALID_DATE);
        }

        if (statDate.isEqual(LocalDate.now())) {
            return getRealTimeStatistics();
        } else {
            DailyStatistics stats = dailyStatisticsRepository.findByStatDate(statDate)
                    .orElseThrow(() -> new CustomException(AdminStatisticsErrorType.ERROR_STATISTICS_NOT_FOUND));
            return convertToDto(stats);
        }
    }

    private DailyStatisticsDTO getRealTimeStatistics() {
        LocalDate today = LocalDate.now();

        Long totalUsers = userRepository.count();
        Long newUsers = userRepository.countByCreatedAtDate(today);
        Long activeUsers = pointRecordRepository.countActiveUsersToday();
        Long totalSurveys = surveyRepository.count();
        Long activeSurveys = surveyRepository.countByState(SurveyState.IN_PROCESS);
        Long totalResponses = userSurveyRepository.count();
        Long dailyResponses = userSurveyRepository.countTodaySurveyResponses();

        Long totalPointsIssued = pointRecordRepository.sumAmountByTypeAndDateRange(PointType.GET, null, null);
        Long dailyPointsIssued = pointRecordRepository.sumAmountByTypeAndDateRange(
                PointType.GET, today.atStartOfDay(), today.atTime(23, 59, 59)
        );

        Long totalPointsUsed = pointRecordRepository.sumAmountByTypeAndDateRange(PointType.USE, null, null);
        Long dailyPointsUsed = pointRecordRepository.sumAmountByTypeAndDateRange(
                PointType.USE, today.atStartOfDay(), today.atTime(23, 59, 59)
        );

        Long currentCirculatingPoints = pointRecordRepository.getCurrentPoints();
        Long totalWithdrawalAmount = withdrawalRequestRepository.sumAmountByDateRange(null, null);
        Long dailyWithdrawalAmount = withdrawalRequestRepository.sumAmountByDateRange(
                today.atStartOfDay(), today.atTime(23, 59, 59)
        );

        Long dailyWithdrawalCount = withdrawalRequestRepository.countTodayWithdrawal();
        Long pendingWithdrawalCount = withdrawalRequestRepository.countByStatus(TransactionStatus.PENDING);
        Long failedWithdrawalCount = withdrawalRequestRepository.countByStatus(TransactionStatus.FAILED);

        Long totalRevenue = pointRecordRepository.sumAllPlatformFees();
        Long dailyRevenue = pointRecordRepository.sumPlatformFeeByTypeAndDateRange(
                ReferenceType.ADMIN, today.atStartOfDay(), today.atTime(23, 59, 59)
        );

        Long totalPaymentCount = paymentRepository.count();
        Long dailyPaymentCount = paymentRepository.countTodayPayment();

        return DailyStatisticsDTO.builder()
                .statDate(today)
                .totalUsers(totalUsers)
                .newUsers(newUsers)
                .activeUsers(activeUsers)
                .totalSurveys(totalSurveys)
                .activeSurveys(activeSurveys)
                .totalResponses(totalResponses)
                .dailyResponses(dailyResponses)
                .totalPointsIssued(totalPointsIssued)
                .dailyPointsIssued(dailyPointsIssued)
                .totalPointsUsed(totalPointsUsed)
                .dailyPointsUsed(dailyPointsUsed)
                .currentCirculatingPoints(currentCirculatingPoints)
                .totalWithdrawalAmount(totalWithdrawalAmount)
                .dailyWithdrawalAmount(dailyWithdrawalAmount)
                .dailyWithdrawalCount(dailyWithdrawalCount)
                .pendingWithdrawalCount(pendingWithdrawalCount)
                .failedWithdrawalCount(failedWithdrawalCount)
                .totalRevenue(totalRevenue)
                .dailyRevenue(dailyRevenue)
                .totalPaymentCount(totalPaymentCount)
                .dailyPaymentCount(dailyPaymentCount)
                .build();
    }

    private DailyStatisticsDTO convertToDto(DailyStatistics entity) {
        return DailyStatisticsDTO.builder()
                .statDate(entity.getStatDate())
                .totalUsers(entity.getTotalUsers())
                .newUsers(entity.getNewUsers())
                .activeUsers(entity.getActiveUsers())
                .totalSurveys(entity.getTotalSurveys())
                .activeSurveys(entity.getActiveSurveys())
                .totalResponses(entity.getTotalResponses())
                .dailyResponses(entity.getDailyResponses())
                .totalPointsIssued(entity.getTotalPointsIssued())
                .dailyPointsIssued(entity.getDailyPointsIssued())
                .totalPointsUsed(entity.getTotalPointsUsed())
                .dailyPointsUsed(entity.getDailyPointsUsed())
                .currentCirculatingPoints(entity.getCurrentCirculatingPoints())
                .totalWithdrawalAmount(entity.getTotalWithdrawalAmount())
                .dailyWithdrawalAmount(entity.getDailyWithdrawalAmount())
                .dailyWithdrawalCount(entity.getDailyWithdrawalCount())
                .pendingWithdrawalCount(entity.getPendingWithdrawalCount())
                .failedWithdrawalCount(entity.getFailedWithdrawalCount())
                .totalRevenue(entity.getTotalRevenue())
                .dailyRevenue(entity.getDailyRevenue())
                .totalPaymentCount(entity.getTotalPaymentCount())
                .dailyPaymentCount(entity.getDailyPaymentCount())
                .build();
    }

    // ==================== 포인트 로그 검색 ====================

    public Page<PointLogDto> getPointLogs(Long userId, String nickname, String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        ReferenceType referenceType = null;
        if (type != null && !type.isEmpty()) {
            try {
                referenceType = ReferenceType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new CustomException(AdminStatisticsErrorType.ERROR_STATISTICS_INVALID_INTERVAL);
            }
        }

        Page<PointRecord> records = pointRecordRepository.searchPointLogs(userId, nickname, referenceType, pageable);
        return records.map(PointLogDto::from);
    }

    // ==================== 그래프 데이터 (일/주/월) ====================

    public GraphResponseDto getPointGraph(String interval) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.minusDays(1); // 어제까지
        LocalDate startDate;

        switch (interval.toLowerCase()) {
            case "daily":
                // 최근 7일: 어제 포함 7일
                startDate = endDate.minusDays(6);
                return buildDailyGraph(startDate, endDate);

            case "weekly":
                // 최근 4주: endDate 기준 4주
                startDate = endDate.minusWeeks(3);
                return buildWeeklyGraph(startDate, endDate);

            case "monthly":
                // 최근 6개월: endDate 기준 6개월
                startDate = endDate.minusMonths(5);
                return buildMonthlyGraph(startDate, endDate);

            default:
                throw new CustomException(AdminStatisticsErrorType.ERROR_STATISTICS_INVALID_INTERVAL);
        }
    }


    private GraphResponseDto buildDailyGraph(LocalDate start, LocalDate end) {
        List<DailyStatistics> stats = dailyStatisticsRepository.findByStatDateBetweenOrderByStatDateAsc(start, end);
        Map<LocalDate, DailyStatistics> statMap = stats.stream()
                .collect(Collectors.toMap(DailyStatistics::getStatDate, s -> s));

        List<String> labels = new ArrayList<>();
        List<Long> newUsersSeries = new ArrayList<>();
        List<Long> activeUsersSeries = new ArrayList<>();
        List<Long> pointsIssuedSeries = new ArrayList<>();
        List<Long> pointsUsedSeries = new ArrayList<>();
        List<Long> revenueSeries = new ArrayList<>();

        LocalDate cursor = start;
        while (!cursor.isAfter(end)) {
            labels.add(cursor.toString());

            DailyStatistics stat = statMap.get(cursor);
            if (stat != null) {
                newUsersSeries.add(stat.getNewUsers());
                activeUsersSeries.add(stat.getActiveUsers());
                pointsIssuedSeries.add(stat.getDailyPointsIssued());
                pointsUsedSeries.add(stat.getDailyPointsUsed());
                revenueSeries.add(stat.getDailyRevenue());
            } else {
                newUsersSeries.add(0L);
                activeUsersSeries.add(0L);
                pointsIssuedSeries.add(0L);
                pointsUsedSeries.add(0L);
                revenueSeries.add(0L);
            }

            cursor = cursor.plusDays(1);
        }

        return GraphResponseDto.builder()
                .interval("daily")
                .labels(labels)
                .newUsersSeries(newUsersSeries)
                .activeUsersSeries(activeUsersSeries)
                .pointsIssuedSeries(pointsIssuedSeries)
                .pointsUsedSeries(pointsUsedSeries)
                .revenueSeries(revenueSeries)
                .build();
    }

    private GraphResponseDto buildWeeklyGraph(LocalDate start, LocalDate end) {
        List<DailyStatistics> stats = dailyStatisticsRepository.findByStatDateBetweenOrderByStatDateAsc(start, end);

        // 주 단위로 그룹핑
        Map<String, List<DailyStatistics>> weeklyMap = stats.stream()
                .collect(Collectors.groupingBy(s -> {
                    int weekOfYear = s.getStatDate().get(WeekFields.ISO.weekOfWeekBasedYear());
                    int year = s.getStatDate().getYear();
                    return year + "-W" + String.format("%02d", weekOfYear);
                }));

        List<String> labels = new ArrayList<>(weeklyMap.keySet());
        Collections.sort(labels);

        List<Long> newUsersSeries = new ArrayList<>();
        List<Long> activeUsersSeries = new ArrayList<>();
        List<Long> pointsIssuedSeries = new ArrayList<>();
        List<Long> pointsUsedSeries = new ArrayList<>();
        List<Long> revenueSeries = new ArrayList<>();

        for (String week : labels) {
            List<DailyStatistics> weekStats = weeklyMap.get(week);
            newUsersSeries.add(weekStats.stream().mapToLong(DailyStatistics::getNewUsers).sum());
            activeUsersSeries.add(weekStats.stream().mapToLong(DailyStatistics::getActiveUsers).sum());
            pointsIssuedSeries.add(weekStats.stream().mapToLong(DailyStatistics::getDailyPointsIssued).sum());
            pointsUsedSeries.add(weekStats.stream().mapToLong(DailyStatistics::getDailyPointsUsed).sum());
            revenueSeries.add(weekStats.stream().mapToLong(DailyStatistics::getDailyRevenue).sum());
        }

        return GraphResponseDto.builder()
                .interval("weekly")
                .labels(labels)
                .newUsersSeries(newUsersSeries)
                .activeUsersSeries(activeUsersSeries)
                .pointsIssuedSeries(pointsIssuedSeries)
                .pointsUsedSeries(pointsUsedSeries)
                .revenueSeries(revenueSeries)
                .build();
    }

    private GraphResponseDto buildMonthlyGraph(LocalDate start, LocalDate end) {
        List<DailyStatistics> stats = dailyStatisticsRepository.findByStatDateBetweenOrderByStatDateAsc(start, end);

        Map<String, List<DailyStatistics>> monthlyMap = stats.stream()
                .collect(Collectors.groupingBy(s -> s.getStatDate().format(DateTimeFormatter.ofPattern("yyyy-MM"))));

        List<String> labels = new ArrayList<>(monthlyMap.keySet());
        Collections.sort(labels);

        List<Long> newUsersSeries = new ArrayList<>();
        List<Long> activeUsersSeries = new ArrayList<>();
        List<Long> pointsIssuedSeries = new ArrayList<>();
        List<Long> pointsUsedSeries = new ArrayList<>();
        List<Long> revenueSeries = new ArrayList<>();

        for (String month : labels) {
            List<DailyStatistics> monthStats = monthlyMap.get(month);
            newUsersSeries.add(monthStats.stream().mapToLong(DailyStatistics::getNewUsers).sum());
            activeUsersSeries.add(monthStats.stream().mapToLong(DailyStatistics::getActiveUsers).sum());
            pointsIssuedSeries.add(monthStats.stream().mapToLong(DailyStatistics::getDailyPointsIssued).sum());
            pointsUsedSeries.add(monthStats.stream().mapToLong(DailyStatistics::getDailyPointsUsed).sum());
            revenueSeries.add(monthStats.stream().mapToLong(DailyStatistics::getDailyRevenue).sum());
        }

        return GraphResponseDto.builder()
                .interval("monthly")
                .labels(labels)
                .newUsersSeries(newUsersSeries)
                .activeUsersSeries(activeUsersSeries)
                .pointsIssuedSeries(pointsIssuedSeries)
                .pointsUsedSeries(pointsUsedSeries)
                .revenueSeries(revenueSeries)
                .build();
    }
}
