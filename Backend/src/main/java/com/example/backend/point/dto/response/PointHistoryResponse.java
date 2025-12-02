package com.example.backend.point.dto.response;

import com.example.backend.point.entity.PointRecord;
import com.example.backend.point.enumType.PointType;
import com.example.backend.point.enumType.ReferenceType;
import com.example.backend.user.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointHistoryResponse {
    private Long pointRecordId;
    private UserEntity user;
    private Long amount;
    private PointType type;
    private String content;
    private Long remainPoint;
    private ReferenceType referenceType;
    private Long referenceId;
    private Long platformFee;
    private LocalDateTime createdAt;

    public static PointHistoryResponse from(PointRecord record) {
        return PointHistoryResponse.builder()
                .pointRecordId(record.getPointRecordId())
                .user(record.getUser())
                .amount(record.getAmount())
                .type(record.getType())
                .content(record.getContent())
                .remainPoint(record.getRemainPoint())
                .referenceType(record.getReferenceType())
                .referenceId(record.getReferenceId())
                .platformFee(record.getPlatformFee())
                .createdAt(record.getCreatedAt())
                .build();
    }
}
