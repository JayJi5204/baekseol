package com.example.backend.survey.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ParticipantStatisticUpdateEvent {
    private final Long surveyId;
}
