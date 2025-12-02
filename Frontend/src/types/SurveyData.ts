// API Response 공통 구조
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 설문 상태
export type SurveyState = "IN_PROCESS" | "DONE" | "CANCELED";

// 정렬 옵션
export type SortOption = "최신순" | "인기순" | "마감임박순" | "리워드많은순";

// ===== 설문 목록 관련 (홈페이지용) =====
export interface SurveyItemResDto {
  surveyId: number;
  title: string;
  responseCnt: number;
  maxResponse: number;
  reward: number;
  createdAt: string;
  deadline: string;
  state: SurveyState;
}

export interface SurveyHomeResponseDto {
  surveyItems: SurveyItemResDto[];
}

// Spring Data Page 구조
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

// 설문 목록 응답 (Page 구조)
export type SurveyListResDto = PageableResponse<SurveyItemResDto>;

// ===== 설문 등록 관련 =====
// 질문 타입 (백엔드 QuestionType enum과 일치)
export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "SUBJECTIVE";

// 선택지 (등록용)
export interface Choice {
  number: number;
  content: string;
}

// 질문 (등록용)
export interface Question {
  number: number;
  content: string;
  type: QuestionType;
  choices: Choice[];
}

// 설문 등록 Request
export interface CreateSurveyRequest {
  title: string;
  description: string;
  maxResponse: number;
  reward: number;
  deadline: string;
  interestId: number;
  questions: Question[];
}

export interface SurveyCreateInfoProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  maxResponse: number;
  setMaxResponse: (value: number) => void;
  reward: number;
  setReward: (value: number) => void;
  deadline: string;
  setDeadline: (value: string) => void;
  interestId: number;
  setInterestId: (value: number) => void;
  userPoint: number;
  isLoadingPoint: boolean;
  questionCnt: number;
  setQuestionCnt: (value: number) => void;
  fee: number;
  pointPerQuestion: number;
  pointPerResponse: number;
  totalRequiredPoint: number;
}

// 설문 등록 Response
export interface Survey {
  title: string;
  description: string;
  maxResponse: number;
  reward: number;
  deadline: string;
  state: SurveyState;
  responseCnt: number;
  questions: Question[];
}

export type CreateSurveyResponse = ApiResponse<Survey>;

// ===== 설문 조회 관련 =====
// 선택지 (조회용 - 백엔드 ChoiceResDto와 일치)
export interface ChoiceResDto {
  number: number;
  content: string;
}

// 질문 (조회용 - 백엔드 QuestionResDto와 일치)
export interface QuestionResDto {
  number: number;
  content: string;
  type: QuestionType;
  choices: ChoiceResDto[]; // 백엔드가 항상 배열 반환 (빈 배열 포함)
}

// 설문 상세 조회 응답 (정보만 조회 - 참여 X)
export interface SurveyDetailResDto {
  title: string;
  description: string;
  maxResponse: number;
  reward: number;
  deadline: string;
  state: SurveyState;
  responseCnt: number;
  questionCnt: number;
  interest: Interest;
}

// 설문 참여용 상세 조회 응답 (질문 포함)
export interface SurveyParticipateResDto {
  title: string;
  description: string;
  maxResponse: number;
  reward: number;
  deadline: string;
  state: SurveyState;
  responseCnt: number;
  questionCnt: number;
  questions: QuestionResDto[]; // 질문 배열 포함
}

// 정렬 타입
export type SortType = "LATEST" | "POPULAR" | "DEADLINE_NEAR" | "REWARD_HIGH";

// 설문 검색 요청
export interface SurveySearchRequest {
  title?: string;
  interestId?: number;
  sortType?: SortType;
  page?: number;
  size?: number;
}

export interface SurveyPointProps {
  userPoint: number;
  reward: number;
  maxResponse: number;
  questionCnt: number;
  isLoadingPoint: boolean;
}

// ===== 설문 참여 관련 (백엔드 AnswerReqDto와 일치) =====
// 질문별 응답 DTO
export interface AnswerReqDto {
  number: number; // 질문 번호
  questionType: QuestionType; // 질문 타입
  content: string; // 주관식 답변 내용
  answerChoices: number[]; // 객관식 선택지 번호들 (단일/다중 선택)
}

// 설문 참여 요청 DTO
export interface SurveyParticipateReqDto {
  answers: AnswerReqDto[];
}

export interface Interest {
  interestId: number;
  content: string; // name → content로 변경
}

export interface DailyStatisticsDTO {
  statDate: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  dailyResponses: number;
  totalPointsIssued: number;
  dailyPointsIssued: number;
  totalPointsUsed: number;
  dailyPointsUsed: number;
  currentCirculatingPoints: number;
  totalWithdrawalAmount: number;
  dailyWithdrawalAmount: number;
  dailyWithdrawalCount: number;
  pendingWithdrawalCount: number;
  failedWithdrawalCount: number;
  totalRevenue: number;
  dailyRevenue: number;
  totalPaymentCount: number;
  dailyPaymentCount: number;
}
// ===== 관리자 통계 관련 =====

// 포인트 로그 단일 항목
export interface PointLogDto {
  id: number;
  userId: number;
  nickname: string;
  email: string;
  pointType: "GET" | "USE";
  referenceType:
    | "PAYMENT"
    | "WITHDRAWAL"
    | "SURVEY_PARTICIPATE"
    | "SURVEY_CREATE"
    | "ADMIN";
  referenceId: number;
  amount: number;
  remainPoint: number;
  platformFee: number | null;
  createdAt: string;
}

// 포인트 로그 페이징 응답
export interface PointLogPageResponse {
  content: PointLogDto[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
}

// 그래프 응답
export interface GraphResponseDto {
  interval: "daily" | "weekly" | "monthly";
  labels: string[];
  newUsersSeries: number[];
  activeUsersSeries: number[];
  pointsIssuedSeries: number[];
  pointsUsedSeries: number[];
  revenueSeries: number[];
}

export enum WorkType {
  IT = "IT",
  OFFICE = "OFFICE",
  MANUFACTURING = "MANUFACTURING",
  SERVICE = "SERVICE",
  EDUCATION = "EDUCATION",
  MEDICAL = "MEDICAL",
  CREATIVE = "CREATIVE",
  STUDENT = "STUDENT",
  SELF_EMPLOYED = "SELF_EMPLOYED",
  ETC = "ETC",
}

export enum AgeGroup {
  TEEN = "TEEN",
  TWENTIES = "TWENTIES",
  THIRTIES = "THIRTIES",
  FORTIES = "FORTIES",
  FIFTIES = "FIFTIES",
  SIXTY_PLUS = "SIXTY_PLUS",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

// WorkType 한글 표시명
export const WorkTypeLabels: Record<WorkType, string> = {
  [WorkType.IT]: "IT/개발",
  [WorkType.OFFICE]: "사무/관리직",
  [WorkType.MANUFACTURING]: "제조/건설",
  [WorkType.SERVICE]: "서비스/판매",
  [WorkType.EDUCATION]: "교육",
  [WorkType.MEDICAL]: "의료",
  [WorkType.CREATIVE]: "창작/디자인/미디어",
  [WorkType.STUDENT]: "학생",
  [WorkType.SELF_EMPLOYED]: "프리랜서/자영업",
  [WorkType.ETC]: "기타",
};

// AgeGroup 한글 표시명
export const AgeGroupLabels: Record<AgeGroup, string> = {
  [AgeGroup.TEEN]: "10대",
  [AgeGroup.TWENTIES]: "20대",
  [AgeGroup.THIRTIES]: "30대",
  [AgeGroup.FORTIES]: "40대",
  [AgeGroup.FIFTIES]: "50대",
  [AgeGroup.SIXTY_PLUS]: "60대 이상",
};

// Gender 한글 표시명
export const GenderLabels: Record<Gender, string> = {
  [Gender.MALE]: "남성",
  [Gender.FEMALE]: "여성",
};

export const WorkTypeOptions = Object.entries(WorkTypeLabels).map(
  ([value, label]) => ({
    value: value as WorkType,
    label,
  })
);

export const AgeGroupOptions = Object.entries(AgeGroupLabels).map(
  ([value, label]) => ({
    value: value as AgeGroup,
    label,
  })
);

export const GenderOptions = Object.entries(GenderLabels).map(
  ([value, label]) => ({
    value: value as Gender,
    label,
  })
);

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
  genderDistribution: DistributionItem<Gender>[];
  ageDistribution: DistributionItem<AgeGroup>[];        // ← 단수로
  workDistribution: DistributionItem<WorkType>[];        // ← 단수로
}


export interface AnswerStatistics {
  questionStatistics: QuestionStatistic[];
}

export interface QuestionStatistic {
  number: number;
  content: string;
  choiceStatistics: ChoiceStatistic[] | null;
  subjectStatistics: string[] | null;
}

export interface ChoiceStatistic {
  number: number;
  content: string;
  count: number;
}

export type QuestionParticipantStatistics = ParticipantStatistics;

export interface SubjectiveStatisticsReq {
  workType?: WorkType;
  ageGroup?: AgeGroup;
  gender?: Gender;
}
// ===== 설문 환불 미리보기 =====
export interface SurveyRefundPreviewResponse {
  surveyId: number;
  totalPaid: number;
  platformFee: number;
  participantCount: number;
  totalRewardPaid: number;
  refundAmount: number;
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

export type SubjectiveAnswerResponse = PageResponse<string>;
