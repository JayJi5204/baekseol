package com.example.backend.survey.entity;


import com.example.backend.global.common.BaseTimeEntity;
import com.example.backend.interest.entity.Interest;
import com.example.backend.survey.enumType.SurveyState;
import com.example.backend.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "surveys")
public class Survey extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long surveyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private UserEntity client; // 의뢰인

    // 설문은 기본적으로 1개의 관심사를 갖는다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interest_id", nullable = false)
    private Interest interest;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("number ASC")
    private List<Question> questions; // 질문 리스트

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("number ASC")
    private List<Answer> answers;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("questionNumber ASC")
    private List<QuestionStatistic> questionStatistics;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserSurvey> userSurveys;

    private String title; // 제목

    private String description; // 설문조사 상세 설명

    @Column(nullable = false)
    @Builder.Default
    private Integer responseCnt = 0; // 현재 응답 횟수

    private Integer maxResponse; // 최대 응답 가능 인원 수

    private Integer questionCnt; // 질문의 갯수

    private Long reward; // 1인당 수령 가능한 포인트

    @Enumerated(EnumType.STRING)
    private SurveyState state; // 상태

    private LocalDateTime deadline; // 마감 일자
}
