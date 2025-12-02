package com.example.backend.survey.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "question_statistics")
public class QuestionStatistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionStatisticId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    private Integer questionNumber; // 질문 번호

    private Integer choiceNumber; // 선택지 번호

    private Integer count; // 선택 횟수
}
