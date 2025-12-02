package com.example.backend.payment.entity;

import com.example.backend.global.common.BaseTimeEntity;
import com.example.backend.payment.enumType.TransactionStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "withdrawal_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WithdrawalTransaction extends BaseTimeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "withdrawal_transaction_id")
    private Long withdrawalTransactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "withdrawal_id", nullable = false)
    private WithdrawalRequest withdrawalRequest;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private TransactionStatus status;
    
    @Column(name = "result_data", columnDefinition = "JSON")
    private String resultData;
    
    @Column(name = "error_message", length = 500)
    private String errorMessage;
}
