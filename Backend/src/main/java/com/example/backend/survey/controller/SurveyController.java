package com.example.backend.survey.controller;

import com.example.backend.global.common.ApiResponse;
import com.example.backend.survey.dto.request.CreateSurveyReqDto;
import com.example.backend.survey.dto.request.SubjectiveStatisticsReqDto;
import com.example.backend.survey.dto.request.SurveyParticipateReqDto;
import com.example.backend.survey.dto.request.SurveySearchReqDto;
import com.example.backend.survey.service.SurveyService;
import com.example.backend.survey.service.SurveyStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import static com.example.backend.survey.exception.SurveySuccessType.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class SurveyController {

    private final SurveyService surveyService;
    private final SurveyStatisticsService surveyStatisticsService;

    private Long userId(Principal principal) {
        return Long.parseLong(principal.getName());
    }

    // 설문 등록
    @PostMapping("/surveys")
    public ResponseEntity<ApiResponse<?>> createSurvey(Principal principal, @RequestBody CreateSurveyReqDto requestForm) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_CREATE_SURVEY,
                surveyService.createSurvey(userId(principal), requestForm)
        ));
    }

    // 단일 설문 조회
    @GetMapping("/surveys/{surveyId}")
    public ResponseEntity<ApiResponse<?>> getSurveyBySurveyId(@PathVariable Long surveyId) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_SURVEY,
                surveyService.getSurveyBySurveyId(surveyId)
        ));
    }

    // 설문 전체 조회
    @GetMapping("/surveys/home")
    public ResponseEntity<ApiResponse<?>> getAllSurvey() {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_SURVEY_LIST,
                surveyService.getAllSurvey()
        ));
    }

    // 내가 의뢰한 설문 조회
    @GetMapping("/surveys/my")
    public ResponseEntity<ApiResponse<?>> getSurveyByClientId(Principal principal) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_SURVEY_LIST,
                surveyService.getSurveyByClientId(userId(principal))
        ));
    }

    // 내가 참여한 설문 조회
    @GetMapping("/surveys/participate")
    public ResponseEntity<ApiResponse<?>> getSurveyListByParticipantId(Principal principal, @PageableDefault Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_SURVEY_LIST,
                surveyService.getSurveyByParticipantId(userId(principal), pageable)
        ));
    }

    // 설문 검색
    @GetMapping("/surveys")
    public ResponseEntity<ApiResponse<?>> getSurveyByCondition(
            @ModelAttribute SurveySearchReqDto condition,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_SURVEY_LIST,
                surveyService.getSurveyByCondition(condition, pageable)
        ));
    }

    // 설문 참여 여부 조회
    @GetMapping("/surveys/{surveyId}/participate")
    public ResponseEntity<ApiResponse<?>> isParticipatedSurvey(Principal principal, @PathVariable("surveyId") Long surveyId) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_PARTICIPATE_YN,
                surveyService.getParticipatedSurvey(userId(principal), surveyId)
        ));
    }

    // 설문 참여
    @PostMapping("/surveys/participate/{surveyId}")
    public ResponseEntity<ApiResponse<?>> participateSurvey(
            Principal principal,
            @PathVariable("surveyId") Long surveyId,
            @RequestBody SurveyParticipateReqDto requestForm
    ) {
        surveyService.participateSurvey(userId(principal), surveyId, requestForm);
        return ResponseEntity.ok(ApiResponse.success(SUCCESS_RESPOND_SURVEY));
    }

    // 질문 목록 조회 (설문 참여)
    @GetMapping("/surveys/{surveyId}/questions")
    public ResponseEntity<ApiResponse<?>> getQuestionsBySurveyId(@PathVariable("surveyId") Long surveyId) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_QUESTIONS,
                surveyService.getQuestionsBySurveyId(surveyId)
        ));
    }
    // 설문 환불 미리보기
    @GetMapping("/surveys/{surveyId}/refund-preview")
    public ResponseEntity<ApiResponse<?>> getSurveyRefundPreview(
            Principal principal,
            @PathVariable Long surveyId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_SURVEY, // 필요하면 별도 SUCCESS 타입 추가
                surveyService.getSurveyRefundPreview(userId(principal), surveyId)
        ));
    }

    // 설문 삭제 (상태 변경)
    @PatchMapping("/surveys/{surveyId}")
    public ResponseEntity<ApiResponse<?>> closeSurveyBySurveyId(Principal principal, @PathVariable Long surveyId) {
        surveyService.closeSurveyBySurveyId(userId(principal), surveyId);
        return ResponseEntity.ok(ApiResponse.success(SUCCESS_CLOSE_SURVEY));
    }

    // 마감 임박 설문 10개 조회
    @GetMapping("/surveys/home/deadline")
    public ResponseEntity<ApiResponse<?>> getTop10ByDeadline() {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_SURVEY_LIST,
                surveyService.getTop10ByDeadline()
        ));
    }

    // 포인트 높은 순 설문 10개 조회
    @GetMapping("/surveys/home/point")
    public ResponseEntity<ApiResponse<?>> getTop10ByPoint() {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_SURVEY_LIST,
                surveyService.getTop10ByReward()
        ));
    }

    // 포인트 높은 순 설문 10개 조회
    @GetMapping("/surveys/home/responseCnt")
    public ResponseEntity<ApiResponse<?>> getTop10ByResponseCnt() {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_SURVEY_LIST,
                surveyService.getTop10ByResponseCnt()
        ));
    }

    // 설문 추천
    @GetMapping("/surveys/recommend")
    public ResponseEntity<ApiResponse<?>> getSurveyByRecommend(Principal principal) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_SURVEY_RECOMMEND,
                surveyService.getSurveyByRecommend(userId(principal))
        ));
    }

    // 설문 참여자 통계 조회 (실시간)
    @GetMapping("/surveys/{surveyId}/statistics/participants")
    public ResponseEntity<ApiResponse<?>> getParticipantStatisticsById(@PathVariable("surveyId") Long surveyId) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_STATISTICS_PARTICIPANTS,
                surveyStatisticsService.getStatisticsParticipants(surveyId)
        ));
    }

    // 설문 응답 통계 조회
    @GetMapping("/surveys/{surveyId}/statistics/answers")
    public ResponseEntity<ApiResponse<?>> getAnswerStatisticsById(Principal principal, @PathVariable("surveyId") Long surveyId) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_STATISTICS_ANSWER,
                surveyStatisticsService.getStatisticsAnswer(userId(principal), surveyId)
        ));
    }

    // 질문별 응답자 분포 검색 (객관식)
    @GetMapping("/surveys/{surveyId}/questions/{questionNumber}/choices/{choiceNumber}/statistics")
    public ResponseEntity<ApiResponse<?>> getDistributionStatisticsByQuestionNumber(
            Principal principal,
            @PathVariable("surveyId") Long surveyId,
            @PathVariable("questionNumber") Integer questionNumber,
            @PathVariable("choiceNumber") Integer choiceNumber
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_STATISTICS_PARTICIPANTS_BY_QUESTION,
                surveyStatisticsService.getStatisticsParticipantsByQuestion(userId(principal), surveyId, questionNumber, choiceNumber)
        ));
    }

    // 분류에 따른 응답 검색 (주관식)
    @GetMapping("/surveys/{surveyId}/questions/{questionNumber}/statistics")
    public ResponseEntity<ApiResponse<?>> getAnswersByCondition(
            @PathVariable("surveyId") Long surveyId,
            @PathVariable("questionNumber") Integer questionNumber,
            @ModelAttribute SubjectiveStatisticsReqDto condition,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                SUCCESS_GET_ANSWERS_FOR_CONDITION,
                surveyStatisticsService.getAnswersByCondition(surveyId, questionNumber, condition, pageable)
        ));
    }
}
