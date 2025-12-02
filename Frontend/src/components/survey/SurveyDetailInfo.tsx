// pages/survey/SurveyDetailInfo.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSurveyById, checkParticipation } from "../../api/SurveyApi";
import type { SurveyDetailResDto } from "../../types/SurveyData";
import {
  FaRegClipboard,
  FaRegMoneyBillAlt,
  FaRegCalendarAlt,
  FaRegUser,
  FaRegListAlt,
  FaChartBar,
  FaCheckCircle,
  FaTag,
} from "react-icons/fa";

function SurveyDetailInfo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<SurveyDetailResDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasParticipated, setHasParticipated] = useState(false);
  const [isCheckingParticipation, setIsCheckingParticipation] = useState(true);

  useEffect(() => {
    const fetchSurveyDetail = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await getSurveyById(Number(id));
        if (response.data) {
          setSurvey(response.data);
        }

        try {
          const participationResponse = await checkParticipation(Number(id));
          setHasParticipated(participationResponse.data);
          console.log("참여 여부:", participationResponse.data);
        } catch (error) {
          console.error("참여 여부 조회 실패:", error);
        } finally {
          setIsCheckingParticipation(false);
        }
      } catch (error) {
        console.error("설문 상세 조회 실패:", error);
        alert("설문을 불러오는데 실패했습니다.");
        navigate("/surveys");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyDetail();
  }, [id, navigate]);

  if (isLoading || isCheckingParticipation) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89369]"></div>
            <h2 className="text-xl font-semibold text-[#B89369]">
              설문을 불러오는 중...
            </h2>
          </div>
        </div>
    );
  }

  if (!survey) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-4xl mb-4 flex justify-center">
              <FaRegClipboard style={{ fontSize: "64px", color: "#B89369" }} />
            </div>
            <h2 className="text-xl font-semibold text-gray-600">
              설문을 찾을 수 없습니다.
            </h2>
            <button
                onClick={() => navigate("/surveys")}
                className="mt-6 px-6 py-3 bg-[#B89369] text-white rounded-lg hover:bg-[#A67F5C] transition-colors font-medium"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
    );
  }

  const progressPercentage = Math.round(
      (survey.responseCnt / survey.maxResponse) * 100
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canParticipate = survey.state === "IN_PROCESS" && !hasParticipated;

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
            onClick={() => navigate("/surveys")}
            className="mb-6 px-4 py-2 bg-white text-[#B89369] border border-[#B89369]/30 rounded-lg hover:bg-[#F3F1E5] transition-all font-medium flex items-center gap-2"
        >
          <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
            />
          </svg>
          목록으로 돌아가기
        </button>

        <div className="bg-white border border-[#B89369]/20 rounded-xl p-8 mb-8 shadow-sm">
          <div className="mb-4 flex gap-2 flex-wrap">
          <span
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border ${
                  survey.state === "IN_PROCESS"
                      ? "bg-green-50 text-green-700 border-green-300"
                      : "bg-[#F3F1E5] text-[#B89369] border-[#B89369]/30"
              }`}
          >
            <FaCheckCircle />
            {survey.state === "IN_PROCESS" ? "진행중" : "종료됨"}
          </span>
            {hasParticipated && (
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-300">
              <FaCheckCircle />
              참여 완료
            </span>
            )}
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-[#F3F1E5] text-[#B89369] border border-[#B89369]/30">
            <FaTag />
              {survey.interest.content}
          </span>
          </div>

          <h1 className="text-4xl font-bold text-[#B89369] mb-4 leading-tight">
            {survey.title}
          </h1>

          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            {survey.description}
          </p>

          {hasParticipated && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <FaCheckCircle className="text-lg" />
                  <span className="font-semibold">이미 참여하신 설문입니다.</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  동일한 설문에는 한 번만 참여할 수 있습니다.
                </p>
              </div>
          )}

          <hr className="border-t-2 border-[#B89369]/20 my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-[#F3F1E5]/50 rounded-lg border border-[#B89369]/15">
              <div className="flex items-center gap-2 text-sm text-[#B89369] font-medium mb-2">
                <FaTag />
                카테고리
              </div>
              <div className="text-lg font-semibold text-gray-700">
                {survey.interest.content}
              </div>
            </div>

            <div className="p-4 bg-[#F3F1E5]/50 rounded-lg border border-[#B89369]/15">
              <div className="flex items-center gap-2 text-sm text-[#B89369] font-medium mb-2">
                <FaRegMoneyBillAlt />
                리워드
              </div>
              <div className="text-2xl font-bold text-[#B89369]">
                {survey.reward.toLocaleString()}P
              </div>
            </div>

            <div className="p-4 bg-[#F3F1E5]/50 rounded-lg border border-[#B89369]/15">
              <div className="flex items-center gap-2 text-sm text-[#B89369] font-medium mb-2">
                <FaRegCalendarAlt />
                마감일
              </div>
              <div className="text-lg font-semibold text-gray-700">
                {formatDate(survey.deadline)}
              </div>
            </div>

            <div className="p-4 bg-[#F3F1E5]/50 rounded-lg border border-[#B89369]/15">
              <div className="flex items-center gap-2 text-sm text-[#B89369] font-medium mb-2">
                <FaRegUser />
                참여자 수
              </div>
              <div className="text-2xl font-bold text-gray-700">
                {survey.responseCnt}{" "}
                <span className="text-lg text-gray-500">
                / {survey.maxResponse}명
              </span>
              </div>
            </div>

            <div className="p-4 bg-[#F3F1E5]/50 rounded-lg border border-[#B89369]/15 md:col-span-2">
              <div className="flex items-center gap-2 text-sm text-[#B89369] font-medium mb-2">
                <FaRegListAlt />
                질문 개수
              </div>
              <div className="text-2xl font-bold text-[#B89369]">
                {survey.questionCnt}개
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <FaChartBar />
              응답 진행률
            </span>
              <span className="text-sm text-[#B89369] font-bold">
              {progressPercentage}%
            </span>
            </div>
            <div className="w-full h-4 bg-[#F3F1E5] rounded-full overflow-hidden border border-[#B89369]/20">
              <div
                  className="h-full bg-[#B89369] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {survey.responseCnt}명 참여
            </span>
              <span className="text-xs text-gray-500">
              목표 {survey.maxResponse}명
            </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
              onClick={() => navigate("/surveys")}
              className="px-8 py-3 bg-white text-[#B89369] border-2 border-[#B89369] rounded-lg hover:bg-[#F3F1E5] transition-all font-semibold"
          >
            취소
          </button>
          <button
              onClick={() => navigate(`/surveys/participate/${id}`)}
              disabled={!canParticipate}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  canParticipate
                      ? "bg-[#B89369] text-white hover:bg-[#A67F5C] shadow-sm hover:shadow-md"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {hasParticipated
                ? "이미 참여함"
                : survey.state !== "IN_PROCESS"
                    ? "종료된 설문"
                    : "설문 참여하기"}
          </button>
        </div>
      </div>
  );
}

export default SurveyDetailInfo;
