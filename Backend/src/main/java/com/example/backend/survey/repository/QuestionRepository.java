package com.example.backend.survey.repository;

import com.example.backend.survey.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query("""
                    SELECT DISTINCT q
                    FROM Question q
                    LEFT JOIN FETCH q.choices
                    WHERE q.survey.surveyId = :surveyId
                    ORDER BY q.number
            """)
    List<Question> findBySurvey_SurveyIdWithChoices(@Param("surveyId") Long surveyId);

    Question findBySurvey_SurveyIdAndNumber(Long surveySurveyId, Integer number);
}
