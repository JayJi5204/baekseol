package com.example.backend.survey.entity;

import com.example.backend.global.common.BaseTimeEntity;
import com.example.backend.global.enumType.AgeGroup;
import com.example.backend.global.enumType.WorkType;
import com.example.backend.interest.entity.Interest;
import com.example.backend.user.entity.UserEntity;
import com.example.backend.user.enumType.Gender;
import jakarta.persistence.*;
import lombok.*;

/* 유저 - 설문조사 참여 여부 */
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "user_surveys",
        indexes = {
                @Index(name = "idx_survey", columnList = "survey_id"),
                @Index(name = "idx_user", columnList = "user_id")
        }
)
public class UserSurvey extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userSurveyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Enumerated(EnumType.STRING)
    private WorkType workType; // 직업 유형

    private Long age; // 나이

    @Enumerated(EnumType.STRING)
    private AgeGroup ageGroup; // 나이대

    @Enumerated(EnumType.STRING)
    private Gender gender; // 성별

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interest_id", nullable = false)
    private Interest interest;
}
