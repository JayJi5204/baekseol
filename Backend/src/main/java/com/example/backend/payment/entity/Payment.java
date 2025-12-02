package com.example.backend.payment.entity;

import com.example.backend.global.common.BaseTimeEntity;
import com.example.backend.payment.enumType.TransactionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="payments")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="payment_id")
    private Long paymentId;

    @Column(name= "user_id",nullable = false)
    private Long userId;

    @Column(name = "payment_key", length = 255)
    private String paymentKey;

    @Column(name = "order_id", nullable = false, length = 255)
    private String orderId;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false,
            columnDefinition = "VARCHAR(50) DEFAULT 'PENDING'")
    private TransactionStatus status;

    @Column(name = "method", length = 50)
    private String method;

    @Column(name = "toss_order_name", length = 255)
    private String tossOrderName;

    @Column(name = "toss_approval_at")
    private LocalDateTime tossApprovalAt;

    @Column(name = "receipt_url", length = 500)
    private String receiptUrl;

    @Column(name = "approval_at")
    private LocalDateTime approvalAt;

    public void startProcessing(String paymentKey) {
        if (this.status != TransactionStatus.PENDING) {
            throw new IllegalStateException("PENDING 상태에서만 처리 시작 가능합니다");
        }
        this.status = TransactionStatus.PROCESSING;
        this.paymentKey = paymentKey;
    }

    public void confirmPayment(LocalDateTime approvalAt,
                               LocalDateTime tossApprovalAt,
                               String receiptUrl,
                               String method) {
        if (this.status != TransactionStatus.PROCESSING) {
            throw new IllegalStateException("PROCESSING 상태에서만 승인 가능합니다");
        }
        this.status = TransactionStatus.CONFIRMED;
        this.approvalAt = approvalAt;
        this.tossApprovalAt = tossApprovalAt;
        this.receiptUrl = receiptUrl;
        this.method = method;
    }

    public void failPayment() {
        if (this.status != TransactionStatus.PROCESSING) {
            throw new IllegalStateException("PROCESSING 상태에서만 실패 처리 가능합니다");
        }
        this.status = TransactionStatus.FAILED;
    }

    public void cancelPayment() {
        if (this.status != TransactionStatus.CONFIRMED) {
            throw new IllegalStateException("CONFIRMED 상태에서만 취소 가능합니다");
        }
        this.status = TransactionStatus.CANCELLED;
    }

    // ✅ 재시도용 리셋 메서드
    public void resetForRetry() {
        if (this.status != TransactionStatus.FAILED) {
            throw new IllegalStateException("FAILED 상태에서만 재시도 가능합니다");
        }
        this.status = TransactionStatus.PENDING;
        this.paymentKey = null;
        this.method = null;
        this.receiptUrl = null;
        this.approvalAt = null;
        this.tossApprovalAt = null;
    }
}
