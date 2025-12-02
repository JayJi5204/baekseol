// api/SurveyApi.ts
import type {
  ApiResponse,
  CreateSurveyRequest,
  CreateSurveyResponse,
  Interest,
  QuestionResDto,
  SurveyDetailResDto,
  SurveyHomeResponseDto,
  SurveyListResDto,
  SurveyParticipateReqDto,
  SurveySearchRequest,
  DailyStatisticsDTO,
  PointLogPageResponse,
  GraphResponseDto,
  SurveyRefundPreviewResponse,
} from "../types/SurveyData";
import jwtAxios from "../utils/JwtUtil";

// 추천 설문 조회 (로그인했을 때만)
export const getSurveyByRecommend = async (): Promise<ApiResponse<SurveyHomeResponseDto>> => {
  const res = await jwtAxios.get<ApiResponse<SurveyHomeResponseDto>>(
      `/surveys/recommend`
  );
  return res.data;
};




// 마감 임박 설문 10개 조회
export const surveyTop10Deadline = async (): Promise<
    ApiResponse<SurveyHomeResponseDto>
> => {
  const res = await jwtAxios.get<ApiResponse<SurveyHomeResponseDto>>(
      `/surveys/home/deadline`
  );
  return res.data;
};

// 포인트 높은 순 설문 10개 조회
export const surveyTop10Point = async (): Promise<
    ApiResponse<SurveyHomeResponseDto>
> => {
  const res = await jwtAxios.get<ApiResponse<SurveyHomeResponseDto>>(
      `/surveys/home/point`
  );
  return res.data;
};

// 참여자 많은 순 설문 10개 조회
export const surveyTop10ResponseCnt = async (): Promise<
    ApiResponse<SurveyHomeResponseDto>
> => {
  const res = await jwtAxios.get<ApiResponse<SurveyHomeResponseDto>>(
      `/surveys/home/responseCnt`
  );
  return res.data;
};

// 단일 설문 조회 (정보만 - questions 없음)
export const getSurveyById = async (
    surveyId: number
): Promise<ApiResponse<SurveyDetailResDto>> => {
  const res = await jwtAxios.get<ApiResponse<SurveyDetailResDto>>(
      `/surveys/${surveyId}`
  );
  return res.data;
};

// ✅ 추가: 질문 목록 조회 (설문 참여용)
export const getSurveyQuestions = async (
    surveyId: number
): Promise<ApiResponse<QuestionResDto[]>> => {
  const res = await jwtAxios.get<ApiResponse<QuestionResDto[]>>(
      `/surveys/${surveyId}/questions`
  );
  return res.data;
};

// ✅ 추가: 설문 참여 여부 조회
export const checkParticipation = async (
    surveyId: number
): Promise<ApiResponse<boolean>> => {
  const res = await jwtAxios.get<ApiResponse<boolean>>(
      `/surveys/${surveyId}/participate`
  );
  return res.data;
};

// 내가 의뢰한 설문 조회
export const getMySurveys = async (): Promise<
    ApiResponse<SurveyHomeResponseDto>
> => {
  const res = await jwtAxios.get<ApiResponse<SurveyHomeResponseDto>>(
      `/surveys/my`
  );
  return res.data;
};

// 내가 참여한 설문 조회
export const getParticipatedSurveys = async (): Promise<
    ApiResponse<SurveyListResDto>
> => {
  const res = await jwtAxios.get<ApiResponse<SurveyListResDto>>(
      `/surveys/participate`
  );
  return res.data;
};

// 내가 참여한 설문 목록 조회 (페이징 포함)
export const getSurveyParticipation = async (
    page: number = 0,
    size: number = 20
): Promise<ApiResponse<SurveyListResDto>> => {
  const res = await jwtAxios.get<ApiResponse<SurveyListResDto>>(
      `/surveys/participate?page=${page}&size=${size}`
  );
  return res.data;
};

// 조건에 따른 설문 검색 (페이지네이션 포함)
export const searchSurveys = async (
    params: SurveySearchRequest
): Promise<ApiResponse<SurveyListResDto>> => {
  const res = await jwtAxios.get<ApiResponse<SurveyListResDto>>(`/surveys`, {
    params,
  });
  return res.data;
};

// ✅ 추가: 설문 추천
export const getRecommendedSurveys = async (): Promise<
    ApiResponse<SurveyHomeResponseDto>
> => {
  const res = await jwtAxios.get<ApiResponse<SurveyHomeResponseDto>>(
      `/surveys/recommend`
  );
  return res.data;
};

// 설문 등록
export const createSurvey = async (
    data: CreateSurveyRequest
): Promise<CreateSurveyResponse> => {
  const res = await jwtAxios.post<CreateSurveyResponse>(`/surveys`, data);
  return res.data;
};

// 설문 삭제 (상태 변경)
export const closeSurvey = async (
    surveyId: number
): Promise<ApiResponse<null>> => {
  const res = await jwtAxios.patch<ApiResponse<null>>(`/surveys/${surveyId}`);
  return res.data;
};

// 설문 참여
export const participateSurvey = async (
    surveyId: number,
    data: SurveyParticipateReqDto
): Promise<ApiResponse<null>> => {
  const res = await jwtAxios.post<ApiResponse<null>>(
      `/surveys/participate/${surveyId}`,
      data
  );
  return res.data;
};
// 관심사 목록 조회
export const getInterests = async (): Promise<ApiResponse<Interest[]>> => {
  const res = await jwtAxios.get<ApiResponse<Interest[]>>(`/interests`);
  return res.data;
};

export const getMyTop3Interests = async (): Promise<
    ApiResponse<Interest[] | string>
> => {
  const res = await jwtAxios.get<ApiResponse<Interest[] | string>>(
      `/interests/my`
  );
  return res.data;
};

// ===== 관리자 통계 API =====

// 특정 날짜 통계 조회 (기존)
export const getAdminStatistics = async (
    statDate: string
): Promise<ApiResponse<DailyStatisticsDTO>> => {
  const res = await jwtAxios.get<ApiResponse<DailyStatisticsDTO>>(
      `/admin/statistics/date/${statDate}`
  );
  return res.data;
};

// 포인트 로그 조회 (전체 + 검색)
// 포인트 로그 조회 (전체 + 검색)
export const getPointLogs = async (
    userId?: number,
    nickname?: string,
    type?: string,
    page: number = 0,
    size: number = 20
): Promise<ApiResponse<PointLogPageResponse>> => {
  const params: Record<string, number | string> = { page, size };
  if (userId) params.userId = userId;
  if (nickname) params.nickname = nickname;
  if (type) params.type = type;

  const res = await jwtAxios.get<ApiResponse<PointLogPageResponse>>(
      `/admin/statistics/points/logs`,
      { params }
  );
  return res.data;
};

// 그래프 데이터 조회 (일/주/월)
export const getPointGraph = async (
    interval: "daily" | "weekly" | "monthly"
): Promise<ApiResponse<GraphResponseDto>> => {
  const res = await jwtAxios.get<ApiResponse<GraphResponseDto>>(
      `/admin/statistics/points/graph`,
      { params: { interval } }
  );
  return res.data;
};


// 설문 환불 미리보기 조회
export const getSurveyRefundPreview = async (
    surveyId: number
): Promise<ApiResponse<SurveyRefundPreviewResponse>> => {
  const res = await jwtAxios.get<ApiResponse<SurveyRefundPreviewResponse>>(
      `/surveys/${surveyId}/refund-preview`
  );
  return res.data;
};