package com.example.backend.survey.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "participant_statistics",
        indexes = {@Index(name = "idx_survey", columnList = "survey_id")}
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipantStatistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long participantStatisticId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    @Column(nullable = false)
    private Integer totalCnt = 0;  // @Builder.Default 제거하고 직접 초기화

    @Column(nullable = false)
    private Integer maxResponse = 0;

    // 성별 분포
    @Column(nullable = false)
    private Integer maleCnt = 0;

    @Column(nullable = false)
    private Integer femaleCnt = 0;

    // 나이대 분포
    @Column(nullable = false)
    private Integer teensCnt = 0;

    @Column(nullable = false)
    private Integer twentiesCnt = 0;

    @Column(nullable = false)
    private Integer thirtiesCnt = 0;

    @Column(nullable = false)
    private Integer fortiesCnt = 0;

    @Column(nullable = false)
    private Integer fiftiesCnt = 0;

    @Column(nullable = false)
    private Integer sixtyPlusCnt = 0;

    // 직업 분포
    @Column(nullable = false)
    private Integer itCnt = 0;

    @Column(nullable = false)
    private Integer officeCnt = 0;

    @Column(nullable = false)
    private Integer manufacturingCnt = 0;

    @Column(nullable = false)
    private Integer serviceCnt = 0;

    @Column(nullable = false)
    private Integer educationCnt = 0;

    @Column(nullable = false)
    private Integer medicalCnt = 0;

    @Column(nullable = false)
    private Integer creativeCnt = 0;

    @Column(nullable = false)
    private Integer studentCnt = 0;

    @Column(nullable = false)
    private Integer selfEmployedCnt = 0;

    @Column(nullable = false)
    private Integer etcCnt = 0;

    @Version
    private Long version;
}
