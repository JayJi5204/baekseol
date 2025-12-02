package com.example.backend.survey.entity;

import com.example.backend.survey.enumType.QuestionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "questions",
        indexes = {
                @Index(name = "idx_survey", columnList = "survey_id")
        }
)
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    private Integer number; // 질문 번호

    private String content; // 질문 내용

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type; // 질문 타입

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("number ASC")
    private List<Choice> choices; // 선택지
}
