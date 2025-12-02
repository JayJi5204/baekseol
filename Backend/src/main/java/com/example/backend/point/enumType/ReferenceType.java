package com.example.backend.point.enumType;

public enum ReferenceType {
    PAYMENT,      // 포인트 충전 (결제)
    SURVEY,       // 설문 생성 (등록비 지불)
    REWARD,       // 설문 참여 보상
    WITHDRAWAL,   // 환급 (포인트 → 계좌)
    REFUND,       // 환불 (설문 취소 → 포인트 반환)
    ADMIN         // 관리자 직접 지급/차감
}
