package com.example.backend.survey.repository;

import com.example.backend.global.enumType.WorkType;
import com.example.backend.survey.entity.Answer;
import com.example.backend.user.enumType.Gender;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findBySurvey_SurveyId(@Param("surveyId") Long surveyId);

    // 조건에 따른 주관식 응답 조회
    @Query("SELECT a FROM Answer a " +
            "JOIN FETCH a.participant p " +
            "WHERE a.survey.surveyId = :surveyId " +
            "AND a.questionNumber = :questionNumber " +
            "AND (:workType IS NULL OR p.workType = :workType) " +
            "AND (:minAge IS NULL OR p.age >= :minAge) " +
            "AND (:maxAge IS NULL OR p.age <= :maxAge) " +
            "AND (:gender IS NULL OR p.gender = :gender) "
    )
    Page<Answer> findByCondition(
            @Param("surveyId") Long surveyId,
            @Param("questionNumber") Integer questionNumber,
            @Param("workType") WorkType workType,
            @Param("minAge") Integer minAge,
            @Param("maxAge") Integer maxAge,
            @Param("gender") Gender gender,
            Pageable pageable
    );
}
