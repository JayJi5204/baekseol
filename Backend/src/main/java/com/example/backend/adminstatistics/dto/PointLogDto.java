package com.example.backend.adminstatistics.dto;

import com.example.backend.point.entity.PointRecord;
import com.example.backend.point.enumType.PointType;
import com.example.backend.point.enumType.ReferenceType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PointLogDto {
    private Long id;
    private Long userId;
    private String nickname;
    private String email;
    private PointType pointType; // GET, USE
    private ReferenceType referenceType; // PAYMENT, WITHDRAWAL, SURVEY_PARTICIPATE, SURVEY_CREATE 등
    private Long referenceId;
    private Long amount;
    private Long remainPoint;
    private Long platformFee;
    private LocalDateTime createdAt;

    public static PointLogDto from(PointRecord record) {
        return PointLogDto.builder()
                .id(record.getPointRecordId())
                .userId(record.getUser().getId())
                .nickname(record.getUser().getUsername())
                .email(record.getUser().getEmail())
                .pointType(record.getType())
                .referenceType(record.getReferenceType())
                .referenceId(record.getReferenceId())
                .amount(record.getAmount())
                .remainPoint(record.getRemainPoint())
                .platformFee(record.getPlatformFee())
                .createdAt(record.getCreatedAt())
                .build();
    }
}
