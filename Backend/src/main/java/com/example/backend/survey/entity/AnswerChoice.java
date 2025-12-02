package com.example.backend.survey.entity;


import jakarta.persistence.*;
import lombok.*;

/* 객관식 선택지 응답 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "answer_choices")
@Entity
public class AnswerChoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long answerChoiceId;

    Integer number; // 선택지 번호
}
