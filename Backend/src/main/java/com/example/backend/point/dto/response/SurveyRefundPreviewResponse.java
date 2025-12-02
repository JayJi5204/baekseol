package com.example.backend.point.dto.response;

/**
 * 설문 종료 전에 환불 예정 금액/수수료/참여 인원 등을 보여주기 위한 응답 DTO.
 * 불변 데이터 전달용이므로 record로 정의.
 */
public record SurveyRefundPreviewResponse(
        Long surveyId,
        long totalPaid,
        long platformFee,
        int participantCount,
        long totalRewardPaid,
        long refundAmount
) {

    /**
     * 환불 미리보기 계산 결과에서 DTO로 변환할 때 사용할 수 있는 편의 메서드 예시.
     * (원하지 않으면 삭제해도 무방)
     */
    public static SurveyRefundPreviewResponse from(
            Long surveyId,
            long totalPaid,
            long platformFee,
            int participantCount,
            long totalRewardPaid,
            long refundAmount
    ) {
        return new SurveyRefundPreviewResponse(
                surveyId,
                totalPaid,
                platformFee,
                participantCount,
                totalRewardPaid,
                refundAmount
        );
    }
}
