import jwtAxios from "../utils/JwtUtil.ts";
import type {
    AnswerStatistics,
    ObjectiveStatisticsResponse,
    ParticipantStatistics, QuestionsResponse,
} from "../types/Statistics.ts";
import type {ApiResponse} from "../types/SurveyData.ts";

// 참여자 통계 조회
export async function getParticipantStatistics(
    surveyId: number
): Promise<ParticipantStatistics> {
    const response = await jwtAxios.get<ApiResponse<ParticipantStatistics>>(
        `/surveys/${surveyId}/statistics/participants`,
    );
    return response.data.data;
}

// 응답 통계 조회
export async function getAnswerStatistics(
    surveyId: number
): Promise<AnswerStatistics> {
    const response = await jwtAxios.get<ApiResponse<AnswerStatistics>>(
        `/surveys/${surveyId}/statistics/answers`
    );
    return response.data.data;
}

// 설문 전체 응답 통계 조회
export const getAnswers = async (surveyId: number): Promise<ObjectiveStatisticsResponse> => {
    const response = await jwtAxios.get(`/surveys/${surveyId}/statistics/answers`);
    return response.data.data;
};

// 특정 선택지를 선택한 응답자 분포 조회
export const getChoiceParticipants = async (
    surveyId: number,
    questionNumber: number,
    choiceNumber: number
): Promise<ParticipantStatistics> => {
    const response = await jwtAxios.get(
        `/surveys/${surveyId}/questions/${questionNumber}/choices/${choiceNumber}/statistics`
    );
    return response.data.data;
};

import type { PageableResponse } from '../types/Statistics';

// 주관식 응답 조회 (필터링)
export const getSubjectiveAnswers = async (
    surveyId: number,
    questionNumber: number,
    filters: {
        workType?: string;
        gender?: string;
        ageGroup?: string;
        page?: number;
        size?: number;
    }
): Promise<PageableResponse<string>> => {
    const params = new URLSearchParams();

    if (filters.workType) params.append('workType', filters.workType);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.ageGroup) params.append('ageGroup', filters.ageGroup);
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());

    const response = await jwtAxios.get(
        `/surveys/${surveyId}/questions/${questionNumber}/statistics?${params.toString()}`
    );
    return response.data.data;
};

// 질문 목록 조회
export const questionApi = {
    getQuestionsBySurveyId: async (surveyId: number): Promise<QuestionsResponse> => {
        const response = await jwtAxios.get<QuestionsResponse>(`/surveys/${surveyId}/questions`);
        return response.data;
    }
};