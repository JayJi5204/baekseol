package com.example.backend.payment.entity;

import com.example.backend.global.common.BaseTimeEntity;
import com.example.backend.payment.enumType.TransactionStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentEvent extends BaseTimeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 50)
    private TransactionStatus status;
    
    @Column(name = "event_data", columnDefinition = "JSON")
    private String eventData;
    
    @Column(name = "description", length = 255)
    private String description;
    
    @Column(name = "error_message", length = 500)
    private String errorMessage;
}
