package com.example.backend.survey.entity;

import com.example.backend.survey.enumType.QuestionType;
import com.example.backend.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "answers",
        indexes = {
                @Index(name = "idx_survey", columnList = "survey_id"),
                @Index(name = "idx_question_number", columnList = "question_number")
        }
)
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long answersId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey; // 설문

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id", nullable = false)
    private UserEntity participant; // 참여자

    private Integer questionNumber; // 질문 번호

    @Enumerated(EnumType.STRING)
    private QuestionType type; // 질문 유형

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "answer_choices", joinColumns = @JoinColumn(name = "answer_id"))
    private List<Integer> answerChoice = new ArrayList<>(); // 객관식 응답

    private String content; // 주관식 응답
}
