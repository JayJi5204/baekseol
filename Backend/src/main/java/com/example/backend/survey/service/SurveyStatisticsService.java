package com.example.backend.survey.service;

import com.example.backend.global.exception.CustomException;
import com.example.backend.survey.dto.projection.DistributionDto;
import com.example.backend.survey.dto.request.SubjectiveStatisticsReqDto;
import com.example.backend.survey.dto.response.ChoiceStatisticsResDto;
import com.example.backend.survey.dto.response.QuestionStatisticsResDto;
import com.example.backend.survey.dto.response.StatisticsAnswersResDto;
import com.example.backend.survey.dto.response.StatisticsParticipantResDto;
import com.example.backend.survey.entity.*;
import com.example.backend.survey.enumType.QuestionType;
import com.example.backend.survey.event.ParticipantStatisticUpdateEvent;
import com.example.backend.survey.repository.*;
import com.example.backend.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.example.backend.survey.exception.SurveyErrorType.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SurveyStatisticsService {

    private final SurveyRepository surveyRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserSurveyRepository userSurveyRepository;
    private final ParticipantStatisticRepository participantStatisticRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ApplicationEventPublisher eventPublisher;

    // 설문 통계 저장
    @Transactional
    public void createParticipantStatistics(Survey survey) {
        ParticipantStatistic participantStatistic = new ParticipantStatistic();
        participantStatistic.setSurvey(survey);
        participantStatistic.setMaxResponse(survey.getMaxResponse());

        participantStatisticRepository.save(participantStatistic);
    }

    // 실시간 통계 업데이트(설문 참여)
    @Transactional
    public void updateParticipantStatistics(Survey survey, UserSurvey userSurvey) {
        ParticipantStatistic statistic = participantStatisticRepository.findBySurvey_SurveyId(survey.getSurveyId())
                .orElseThrow(() -> new CustomException(ERROR_GET_STATISTICS_NO_CONTENT));

        statistic.setTotalCnt(statistic.getTotalCnt() + 1);

        if (userSurvey.getGender() != null) {
            switch (userSurvey.getGender()) {
                case MALE -> statistic.setMaleCnt(statistic.getMaleCnt() + 1);
                case FEMALE -> statistic.setFemaleCnt(statistic.getFemaleCnt() + 1);
            }
        }

        if (userSurvey.getAgeGroup() != null) {
            switch (userSurvey.getAgeGroup()) {
                case TEEN -> statistic.setTeensCnt(statistic.getTeensCnt() + 1);
                case TWENTIES -> statistic.setTwentiesCnt(statistic.getTwentiesCnt() + 1);
                case THIRTIES -> statistic.setThirtiesCnt(statistic.getThirtiesCnt() + 1);
                case FORTIES -> statistic.setFortiesCnt(statistic.getFortiesCnt() + 1);
                case FIFTIES -> statistic.setFiftiesCnt(statistic.getFiftiesCnt() + 1);
                case SIXTY_PLUS -> statistic.setSixtyPlusCnt(statistic.getSixtyPlusCnt() + 1);
            }
        }

        if (userSurvey.getWorkType() != null) {
            switch (userSurvey.getWorkType()) {
                case IT -> statistic.setItCnt(statistic.getItCnt() + 1);
                case OFFICE -> statistic.setOfficeCnt(statistic.getOfficeCnt() + 1);
                case MANUFACTURING -> statistic.setManufacturingCnt(statistic.getManufacturingCnt() + 1);
                case SERVICE -> statistic.setServiceCnt(statistic.getServiceCnt() + 1);
                case EDUCATION -> statistic.setEducationCnt(statistic.getEducationCnt() + 1);
                case MEDICAL -> statistic.setMedicalCnt(statistic.getMedicalCnt() + 1);
                case CREATIVE -> statistic.setCreativeCnt(statistic.getCreativeCnt() + 1);
                case STUDENT -> statistic.setStudentCnt(statistic.getStudentCnt() + 1);
                case SELF_EMPLOYED -> statistic.setSelfEmployedCnt(statistic.getSelfEmployedCnt() + 1);
                case ETC -> statistic.setEtcCnt(statistic.getEtcCnt() + 1);
            }
        }

        eventPublisher.publishEvent(new ParticipantStatisticUpdateEvent(survey.getSurveyId()));
    }

    // WebSocket 브로드캐스트
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void broadcastParticipantStatistics(ParticipantStatisticUpdateEvent event) {
        StatisticsParticipantResDto response = getStatisticsParticipants(event.getSurveyId());
        messagingTemplate.convertAndSend("/topic/survey/" + event.getSurveyId() + "/statistics", response);
    }

    // 실시간 참여자 통계 조회
    @Transactional
    public StatisticsParticipantResDto getStatisticsParticipants(Long surveyId) {
        ParticipantStatistic statistic = participantStatisticRepository.findBySurvey_SurveyId(surveyId)
                .orElseThrow(() -> new CustomException(ERROR_GET_STATISTICS_NO_CONTENT));

        Integer total = statistic.getTotalCnt();

        return StatisticsParticipantResDto.builder()
                .responseCnt(total)
                .maxResponse(statistic.getMaxResponse())
                .genderDistribution(buildGenderDistribution(statistic))
                .ageDistribution(buildAgeDistribution(statistic))
                .workDistribution(buildWorkDistribution(statistic))
                .build();
    }

    // 질문별 응답 통계 조회
    @Transactional
    public StatisticsAnswersResDto getStatisticsAnswer(Long clientId, Long surveyId) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new CustomException(ERROR_GET_STATISTICS_NO_CONTENT));

        UserEntity client = survey.getClient();
        if (!clientId.equals(client.getId())) throw new CustomException(ERROR_GET_STATISTICS_NOT_PERMISSION);

        List<Question> questions = questionRepository.findBySurvey_SurveyIdWithChoices(surveyId);

        List<Answer> answers = answerRepository.findBySurvey_SurveyId(surveyId);

        List<QuestionStatisticsResDto> questionStatistics = questions.stream()
                .map(question -> createQuestionStatistics(question, answers))
                .toList();

        return StatisticsAnswersResDto.from(questionStatistics);
    }

    // 질문별 통계 생성
    private QuestionStatisticsResDto createQuestionStatistics(Question question, List<Answer> answers) {
        // 질문에 대한 답변 필터링
        List<Answer> questionAnswers = answers.stream()
                .filter(answer -> answer.getQuestionNumber().equals(question.getNumber()))
                .toList();

        if (question.getType() == QuestionType.SINGLE_CHOICE || question.getType() == QuestionType.MULTIPLE_CHOICE) {
            List<ChoiceStatisticsResDto> choiceStatistics = createChoiceStatistics(
                    question.getChoices(),
                    questionAnswers
            );

            return QuestionStatisticsResDto.ofSelective(
                    question.getNumber(),
                    question.getContent(),
                    choiceStatistics
            );
        } else {
            List<String> subjectiveAnswers = questionAnswers.stream()
                    .map(Answer::getContent)
                    .filter(content -> content != null && !content.isBlank())
                    .toList();
            return QuestionStatisticsResDto.ofSubjective(
                    question.getNumber(),
                    question.getContent(),
                    subjectiveAnswers
            );
        }
    }

    // 객관식 선택지 통계 생성
    private List<ChoiceStatisticsResDto> createChoiceStatistics(List<Choice> choices, List<Answer> answers) {
        Map<Integer, Long> choiceCountMap = answers.stream()
                .flatMap(answer -> answer.getAnswerChoice().stream())
                .collect(Collectors.groupingBy(
                        number -> number,
                        Collectors.counting()
                ));
        return choices.stream()
                .map(choice -> {
                    Integer number = choice.getNumber();
                    Long count = choiceCountMap.getOrDefault(number, 0L);

                    return ChoiceStatisticsResDto.of(number, choice.getContent(), count);
                })
                .toList();
    }

    // 성별별 분포 빌드
    private List<DistributionDto> buildGenderDistribution(ParticipantStatistic statistic) {
        return List.of(
                DistributionDto.builder()
                        .label("MALE")
                        .count(statistic.getMaleCnt())
                        .build(),
                DistributionDto.builder()
                        .label("FEMALE")
                        .count(statistic.getFemaleCnt())
                        .build()
        );
    }

    // 나이대별 분포 빌드
    private List<DistributionDto> buildAgeDistribution(ParticipantStatistic statistic) {
        return List.of(
                DistributionDto.builder()
                        .label("TEEN")
                        .count(statistic.getTeensCnt())
                        .build(),
                DistributionDto.builder()
                        .label("TWENTIES")
                        .count(statistic.getTwentiesCnt())
                        .build(),
                DistributionDto.builder()
                        .label("THIRTIES")
                        .count(statistic.getThirtiesCnt())
                        .build(),
                DistributionDto.builder()
                        .label("FORTIES")
                        .count(statistic.getFortiesCnt())
                        .build(),
                DistributionDto.builder()
                        .label("FIFTIES")
                        .count(statistic.getFiftiesCnt())
                        .build(),
                DistributionDto.builder()
                        .label("SIXTY_PLUS")
                        .count(statistic.getSixtyPlusCnt())
                        .build()
        );
    }

    // 직업별 분포 빌드
    private List<DistributionDto> buildWorkDistribution(ParticipantStatistic statistic) {
        return List.of(
                DistributionDto.builder()
                        .label("IT")
                        .count(statistic.getItCnt())
                        .build(),
                DistributionDto.builder()
                        .label("OFFICE")
                        .count(statistic.getOfficeCnt())
                        .build(),
                DistributionDto.builder()
                        .label("MANUFACTURING")
                        .count(statistic.getManufacturingCnt())
                        .build(),
                DistributionDto.builder()
                        .label("SERVICE")
                        .count(statistic.getServiceCnt())
                        .build(),
                DistributionDto.builder()
                        .label("EDUCATION")
                        .count(statistic.getEducationCnt())
                        .build(),
                DistributionDto.builder()
                        .label("MEDICAL")
                        .count(statistic.getMedicalCnt())
                        .build(),
                DistributionDto.builder()
                        .label("CREATIVE")
                        .count(statistic.getCreativeCnt())
                        .build(),
                DistributionDto.builder()
                        .label("STUDENT")
                        .count(statistic.getStudentCnt())
                        .build(),
                DistributionDto.builder()
                        .label("SELF_EMPLOYED")
                        .count(statistic.getSelfEmployedCnt())
                        .build(),
                DistributionDto.builder()
                        .label("ETC")
                        .count(statistic.getEtcCnt())
                        .build()
        );
    }

    // 질문별 응답자 분포 조회
    @Transactional
    public StatisticsParticipantResDto getStatisticsParticipantsByQuestion(Long clientId, Long surveyId, Integer questionNumber, Integer choiceNumber) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new CustomException(ERROR_GET_STATISTICS_NO_CONTENT));

        Question question = questionRepository.findBySurvey_SurveyIdAndNumber(surveyId, questionNumber);
        if (question.getType() == QuestionType.SUBJECTIVE)
            throw new CustomException(ERROR_GET_STATISTICS_QUESTION_TYPE_MISMATCH);

        UserEntity client = survey.getClient();
        if (!clientId.equals(client.getId())) throw new CustomException(ERROR_GET_STATISTICS_NOT_PERMISSION);

        List<UserSurvey> userSurveys = userSurveyRepository.findByQuestionAndChoice(surveyId, questionNumber, choiceNumber);
        Integer responseCnt = survey.getResponseCnt();

        // 성별별 응답자 분포
        List<DistributionDto> genderDistribution = userSurveys.stream()
                .collect(Collectors.groupingBy(
                        UserSurvey::getGender,
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> DistributionDto.builder()
                        .label(entry.getKey().name())
                        .count(entry.getValue().intValue())
                        .build())
                .toList();

        // 나이대별 응답자 분포
        List<DistributionDto> ageGroupDistribution = userSurveys.stream()
                .collect(Collectors.groupingBy(
                        UserSurvey::getAgeGroup,
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> DistributionDto.builder()
                        .label(entry.getKey().name())
                        .count(entry.getValue().intValue())
                        .build())
                .toList();

        // 직업군별 응답자 분포
        List<DistributionDto> workTypeDistribution = userSurveys.stream()
                .collect(Collectors.groupingBy(
                        UserSurvey::getWorkType,
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> DistributionDto.builder()
                        .label(entry.getKey().name())
                        .count(entry.getValue().intValue())
                        .build())
                .toList();

        return StatisticsParticipantResDto.of(
                responseCnt,
                null,
                genderDistribution,
                ageGroupDistribution,
                workTypeDistribution
        );
    }

    // 유형별 응답 검색
    public Page<String> getAnswersByCondition(Long surveyId, Integer questionNumber, SubjectiveStatisticsReqDto condition, Pageable pageable) {
        Question question = questionRepository.findBySurvey_SurveyIdAndNumber(surveyId, questionNumber);
        if (question.getType() != QuestionType.SUBJECTIVE)
            throw new CustomException(ERROR_GET_STATISTICS_QUESTION_TYPE_MISMATCH);

        Integer minAge = condition.ageGroup() != null ? condition.ageGroup().getMinAge() : null;
        Integer maxAge = condition.ageGroup() != null ? condition.ageGroup().getMaxAge() : null;

        Page<Answer> answers = answerRepository.findByCondition(surveyId, questionNumber, condition.workType(), minAge, maxAge, condition.gender(), pageable);

        return answers.map(Answer::getContent);
    }
}
