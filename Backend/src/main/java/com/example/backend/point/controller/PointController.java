// point/controller/PointController.java
package com.example.backend.point.controller;

import com.example.backend.global.common.ApiResponse;
import com.example.backend.point.dto.response.PointHistoryResponse;
import com.example.backend.point.entity.PointRecord;
import com.example.backend.point.exception.PointSuccessType;
import com.example.backend.point.service.PointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/points")
@RequiredArgsConstructor
@Slf4j
public class PointController {

    private final PointService pointService;

    /**
     * 포인트 내역 조회 - 본인만 가능
     */
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<PointHistoryResponse>>> getPointHistory(
            Authentication authentication) {

        Long userId = Long.parseLong(authentication.getName());
        log.info("포인트 내역 조회: userId={}", userId);

        List<PointRecord> records = pointService.getPointHistory(userId);

        List<PointHistoryResponse> response = records.stream()
                .map(PointHistoryResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success(PointSuccessType.SUCCESS_INQUIRY_POINT_HISTORY, response)
        );
    }

    /**
     * 현재 포인트 조회 - 본인만 가능
     */
    @GetMapping("/balance")
    public ResponseEntity<ApiResponse<Long>> getPointBalance(
            Authentication authentication) {

        Long userId = Long.parseLong(authentication.getName());
        log.info("포인트 잔액 조회: userId={}", userId);

        Long points = pointService.getUserPoints(userId);

        return ResponseEntity.ok(
                ApiResponse.success(PointSuccessType.SUCCESS_INQUIRY_POINT_BALANCE, points)
        );
    }
}
