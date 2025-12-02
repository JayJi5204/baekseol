package com.example.backend.survey.repository;

import com.example.backend.survey.entity.UserSurvey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSurveyRepository extends JpaRepository<UserSurvey, Long> {
    boolean existsByUser_IdAndSurvey_SurveyId(Long userId, Long surveySurveyId);

    // 응답별 성별 분포 조회
    @Query("""
                SELECT us FROM UserSurvey us
                JOIN Answer a ON a.participant = us.user AND a.survey = us.survey
                WHERE us.survey.surveyId = :surveyId
                AND a.questionNumber = :questionNumber
                AND :choiceNumber MEMBER OF a.answerChoice
            """)
    List<UserSurvey> findByQuestionAndChoice(
            @Param("surveyId") Long surveyId,
            @Param("questionNumber") Integer questionNumber,
            @Param("choiceNumber") Integer choiceNumber
    );

    // 참여자 ID로 참여 목록 조회
    @Query("""
                SELECT us
                FROM UserSurvey us
                JOIN FETCH us.interest
                JOIN FETCH us.survey
                WHERE us.user.id = :userId
                ORDER BY us.createdAt DESC
            """)
    List<UserSurvey> findByUserIdWithInterestAndSurvey(Long userId);

    // 오늘 설문 응답(참여) 건수 조회
    @Query("SELECT COUNT(us) FROM UserSurvey us WHERE DATE(us.createdAt) = CURRENT_DATE")
    Long countTodaySurveyResponses();
}
