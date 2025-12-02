package com.example.backend.survey.repository;

import com.example.backend.survey.entity.ParticipantStatistic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParticipantStatisticRepository extends JpaRepository<ParticipantStatistic, Long> {
    Optional<ParticipantStatistic> findBySurvey_SurveyId(Long surveyId);
}
