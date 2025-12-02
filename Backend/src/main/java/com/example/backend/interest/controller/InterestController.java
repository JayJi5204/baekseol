package com.example.backend.interest.controller;

import com.example.backend.global.common.ApiResponse;
import com.example.backend.global.exception.type.SuccessType;
import com.example.backend.interest.service.InterestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

import static com.example.backend.interest.exception.InterestSuccessType.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class InterestController {

    private final InterestService interestService;
    private Long userId(Principal principal) {
        return Long.parseLong(principal.getName());
    }

    // 전체 관심사 조회
    @GetMapping("/interests")
    public ResponseEntity<ApiResponse<?>> getAllInterests() {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_INTEREST,
                interestService.getAllInterests()
        ));
    }

    // 나의 관심사 조회
    @GetMapping("/interests/my")
    public ResponseEntity<ApiResponse<?>> getMyInterests(Principal principal) {
        System.out.println(principal.getClass()+ principal.getName());
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_MY_INTEREST,
                interestService.getInterestByUserId(userId(principal))
        ));
    }
}
