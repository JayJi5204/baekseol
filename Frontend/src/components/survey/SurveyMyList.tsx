// components/survey/SurveyMyList.tsx
import type { SurveyItemResDto } from "../../types/SurveyData";
import { useNavigate } from "react-router-dom";

interface SurveyMyListProps {
  surveys: SurveyItemResDto[];
  onSurveyUpdated: () => void;
}

function SurveyMyList({ surveys }: SurveyMyListProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStateText = (state: string) => {
    if (state === "IN_PROCESS") return "진행중";
    if (state === "DONE") return "마감";
    if (state === "CANCELED") return "취소됨";
    return state;
  };

  const getStateColor = (state: string) => {
    if (state === "IN_PROCESS") return "bg-green-100 text-green-800";
    if (state === "DONE") return "bg-gray-100 text-gray-800";
    if (state === "CANCELED") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // 설문 내리기 핸들러 - 비밀번호 확인 페이지로 이동
  const handleCloseSurvey = (
    e: React.MouseEvent,
    surveyId: number,
    title: string
  ) => {
    e.stopPropagation();

    // 비밀번호 확인 후 돌아올 URL에 설문 정보 포함
    const returnUrl = `/surveys/my?action=closeSurvey&surveyId=${surveyId}&title=${encodeURIComponent(
      title
    )}`;

    navigate(`/users/check/password?next=${encodeURIComponent(returnUrl)}`);
  };

  return (
    <div className="bg-white rounded-b-lg shadow-sm border-x border-b border-[#B89369]/20 overflow-hidden">
      <div className="divide-y divide-[#B89369]/10">
        {surveys.map((survey) => (
          <div
            key={survey.surveyId}
            className="grid grid-cols-1 md:grid-cols-12 hover:bg-[#F3F1E5]/30 cursor-pointer transition-colors"
            onClick={() => navigate(`/surveys/${survey.surveyId}/statistics`)}
          >
            {/* 모바일 레이아웃 */}
            <div className="md:hidden p-4 space-y-3">
              <div className="flex justify-between items-start gap-3">
                <h3 className="font-medium text-base flex-1 text-[#B89369]">
                  {survey.title}
                </h3>
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStateColor(
                    survey.state
                  )}`}
                >
                  {getStateText(survey.state)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  참여: {survey.responseCnt}/{survey.maxResponse}
                </span>
                <div className="text-xs text-gray-500 text-right">
                  <div>생성: {formatDate(survey.createdAt)}</div>
                  <div>마감: {formatDate(survey.deadline)}</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#B89369] h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (survey.responseCnt / survey.maxResponse) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              {/* 모바일 버튼 */}
              {survey.state === "IN_PROCESS" && (
                <button
                  onClick={(e) =>
                    handleCloseSurvey(e, survey.surveyId, survey.title)
                  }
                  className="w-full px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  설문 내리기
                </button>
              )}
            </div>

            {/* 데스크탑 레이아웃 */}
            <div className="hidden md:contents">
              <div className="col-span-3 px-6 py-4">
                <h3 className="font-medium text-sm truncate text-[#B89369]">
                  {survey.title}
                </h3>
              </div>

              <div className="col-span-2 px-6 py-4 text-center">
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStateColor(
                    survey.state
                  )}`}
                >
                  {getStateText(survey.state)}
                </span>
              </div>

              <div className="col-span-2 px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-gray-600">
                    {survey.responseCnt}/{survey.maxResponse}
                  </span>
                </div>
              </div>

              <div className="col-span-2 px-6 py-4 text-center text-sm text-gray-600">
                {formatDate(survey.createdAt)}
              </div>

              <div className="col-span-2 px-6 py-4 text-center text-sm text-gray-600">
                {formatDate(survey.deadline)}
              </div>

              <div className="col-span-1 px-6 py-4 flex items-center justify-center">
                {survey.state === "IN_PROCESS" ? (
                  <button
                    onClick={(e) =>
                      handleCloseSurvey(e, survey.surveyId, survey.title)
                    }
                    className="px-4 py-1.5 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 transition-colors whitespace-nowrap"
                  >
                    내리기
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SurveyMyList;
