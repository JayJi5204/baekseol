import { WorkType, AgeGroup, Gender } from './enums';

// 응답자의 분포 유형
export interface DistributionItem<T = string> {
    label: T;
    count: number;
}

export type GenderDistributionItem = DistributionItem<Gender>;
export type AgeDistributionItem = DistributionItem<AgeGroup>;
export type WorkDistributionItem = DistributionItem<WorkType>;

export interface ParticipantStatistics {
    responseCnt: number;
    maxResponse: number;
    genderDistribution: DistributionItem[];  // ← 이렇게 명시
    ageDistribution: DistributionItem[];
    workDistribution: DistributionItem[];
}

export interface AnswerStatistics {
    questionStatistics: QuestionStatistic[];
}

export interface ChoiceStatistic {
    number: number;
    content: string;
    count: number;
}

export interface QuestionStatistic {
    number: number;
    content: string;
    choiceStatistics: ChoiceStatistic[] | null;
    subjectStatistics: string[] | null;
}

export type QuestionParticipantStatistics = ParticipantStatistics;

export interface SubjectiveStatisticsReq {
    workType?: WorkType;
    ageGroup?: AgeGroup;
    gender?: Gender;
}

export interface PageResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface ObjectiveStatisticsResponse {
    questionStatistics: QuestionStatistic[];
}

export type SubjectiveAnswerResponse = PageResponse<string>;

// 주관식 응답 페이지
export interface PageableResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export type PageableSubjectiveResponse = PageableResponse<string>;

export interface Choice {
    number: number;
    content: string;
}

export interface Question {
    number: number;
    content: string;
    type: 'MULTIPLE_CHOICE' | 'SUBJECTIVE';
    choices: Choice[];
}

export interface QuestionsResponse {
    code: number;
    message: string;
    data: Question[];
}