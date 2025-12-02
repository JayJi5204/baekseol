package com.example.backend.payment.entity;

import com.example.backend.global.common.BaseTimeEntity;
import com.example.backend.payment.enumType.TransactionStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "withdrawal_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WithdrawalRequest extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "withdrawal_id")
    private Long withdrawalId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "bank_code", nullable = false, length = 10)
    private String bankCode;

    @Column(name = "account", nullable = false, length = 100)
    private String account;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "VARCHAR(50) DEFAULT 'PENDING'")
    private TransactionStatus status;

    @Column(name = "toss_payout_id", length = 255)
    private String tossPayoutId;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    // 상태 변경 메서드들
    public void startProcessing() {
        if (this.status != TransactionStatus.PENDING) {
            throw new IllegalStateException("PENDING 상태에서만 처리 시작 가능합니다");
        }
        this.status = TransactionStatus.PROCESSING;
        this.processedAt = LocalDateTime.now();
    }

    public void complete(String payoutId) {
        if (this.status != TransactionStatus.PROCESSING) {
            throw new IllegalStateException("PROCESSING 상태에서만 완료 처리 가능합니다");
        }
        this.status = TransactionStatus.COMPLETED;
        this.tossPayoutId = payoutId;
        this.completedAt = LocalDateTime.now();
    }

    public void fail(String reason) {
        if (this.status != TransactionStatus.PROCESSING) {
            throw new IllegalStateException("PROCESSING 상태에서만 실패 처리 가능합니다");
        }
        this.status = TransactionStatus.FAILED;
        this.failureReason = reason;
    }
}
