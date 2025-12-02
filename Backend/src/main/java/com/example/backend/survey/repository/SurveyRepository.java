package com.example.backend.survey.repository;

import com.example.backend.interest.entity.Interest;
import com.example.backend.survey.entity.Survey;
import com.example.backend.survey.enumType.SurveyState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    Optional<List<Survey>> findAllByClientIdOrderByCreatedAtDesc(Long clientId);

    // 설문 검색
    @Query("""
            SELECT s FROM Survey s
            WHERE (:title IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%')))
            AND (:interestId IS NULL OR s.interest.interestId = :interestId)
            AND (:state IS NULL OR s.state = :state)
            """)
    Page<Survey> findAllByCondition(
            @Param("title") String title,
            @Param("interestId") Long interestId,
            @Param("state") SurveyState state,
            Pageable pageable
    );

    // 내가 참여한 설문 조회
    @Query("""
            SELECT s
            FROM Survey s
            JOIN s.userSurveys us
            WHERE us.user.id = :userId
            ORDER BY s.createdAt DESC
            """)
    Page<Survey> findAllByParticipantId(@Param("userId") Long userId, Pageable pageable);

    @Query("""
            SELECT s
            FROM Survey s
            WHERE s.state = :state
            AND s.deadline > CURRENT_TIMESTAMP
            ORDER BY s.deadline ASC
            """)
    List<Survey> findTop10ByDeadlineImminent(@Param("state") SurveyState state, Pageable pageable);

    @Query("""
            SELECT s
            FROM Survey s
            WHERE s.state = :state
            ORDER BY s.reward DESC
            """)
    List<Survey> findTop10ByRewardImminent(@Param("state") SurveyState state, Pageable pageable);

    @Query("""
            SELECT s
            FROM Survey s
            WHERE s.state = :state
            ORDER BY s.responseCnt DESC
            """)
    List<Survey> findTop10ByResponseCntImminent(@Param("state") SurveyState state, Pageable pageable);

    // 추천 설문 조회
    @Query("""
            SELECT DISTINCT s
            FROM Survey s
            WHERE s.interest IN :topInterests
            AND s.surveyId NOT IN :participatedSurveyIds
            AND s.state = "IN_PROCESS"
            ORDER BY s.createdAt DESC
            """)
    List<Survey> findByInterestInAndNotParticipated(List<Interest> topInterests, Set<Long> participatedSurveyIds);

    // 마감할 설문 조회
    @Query("""
            SELECT s
            FROM Survey s
            WHERE s.deadline < :now
            AND s.state = 'IN_PROCESS'
            """)
    List<Survey> findExpiredSurveyByDeadline(@Param("now") LocalDateTime now);

    // 설문 마감
    @Modifying
    @Query("UPDATE Survey s SET s.state = :doneState WHERE s.state = :inProcessState AND s.deadline < :now")
    void bulkUpdateExpiredSurveys(SurveyState doneState, SurveyState inProcessState, LocalDateTime now);

    // 특정 상태(예: 진행중)인 설문 수 조회
    Long countByState(SurveyState state);
}
