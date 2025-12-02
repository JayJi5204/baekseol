package com.example.backend.adminstatistics.controller;

import com.example.backend.adminstatistics.dto.DailyStatisticsDTO;
import com.example.backend.adminstatistics.dto.GraphResponseDto;
import com.example.backend.adminstatistics.dto.PointLogDto;
import com.example.backend.adminstatistics.exception.AdminStatisticsSuccessType;
import com.example.backend.adminstatistics.service.AdminStatisticsService;
import com.example.backend.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/admin/statistics")
@RequiredArgsConstructor
public class AdminStatisticsController {

    private final AdminStatisticsService adminStatisticsService;

    // 기존: 특정 날짜 통계 조회
    @GetMapping("/date/{statDate}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DailyStatisticsDTO>> getStatisticsByDate(@PathVariable String statDate) {
        LocalDate date = LocalDate.parse(statDate);
        DailyStatisticsDTO dto = adminStatisticsService.getStatisticsByDate(date);
        return ResponseEntity.ok(ApiResponse.success(AdminStatisticsSuccessType.SUCCESS_GET_STATISTICS, dto));
    }

    // 포인트 로그 전체 조회 + 검색
    @GetMapping("/points/logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<PointLogDto>>> getPointLogs(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String nickname,
            @RequestParam(required = false) String type, // PAYMENT, WITHDRAWAL, SURVEY_PARTICIPATE, SURVEY_CREATE 등
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<PointLogDto> result = adminStatisticsService.getPointLogs(userId, nickname, type, page, size);
        return ResponseEntity.ok(ApiResponse.success(AdminStatisticsSuccessType.SUCCESS_GET_STATISTICS, result));
    }

    // 그래프 데이터 (일/주/월)
    @GetMapping("/points/graph")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<GraphResponseDto>> getPointGraph(
            @RequestParam String interval // daily, weekly, monthly
    ) {
        GraphResponseDto result = adminStatisticsService.getPointGraph(interval);
        return ResponseEntity.ok(ApiResponse.success(AdminStatisticsSuccessType.SUCCESS_GET_STATISTICS, result));
    }
}
