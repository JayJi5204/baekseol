// src/components/hompage/HomePageComponent.tsx
import { useNavigate } from "react-router-dom";
import type { SurveyItemResDto } from "../../types/SurveyData";

interface HomePageComponentProps {
  survey: SurveyItemResDto;
  hasParticipated?: boolean; // 참여 여부
}

function HomePageComponent({
                             survey,
                             hasParticipated = false,
                           }: HomePageComponentProps) {
  const navigate = useNavigate();

  // 마감까지 남은 일수
  const getDaysLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil(
        (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) return { text: "마감", badgeClass: "bg-gray-100 text-gray-500" };
    if (diff === 0) return { text: "D-Day", badgeClass: "bg-red-100 text-red-600" };
    if (diff <= 3) return { text: `D-${diff}`, badgeClass: "bg-red-100 text-red-600" };
    if (diff <= 7) return { text: `D-${diff}`, badgeClass: "bg-orange-100 text-orange-600" };
    return { text: `D-${diff}`, badgeClass: "bg-green-100 text-green-600" };
  };

  const daysLeft = getDaysLeft(survey.deadline);

  // 마감일 포맷팅
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  // 참여율 계산
  const participationRate = Math.round(
      (survey.responseCnt / survey.maxResponse) * 100
  );

  // 클릭 시 상세 페이지로
  const handleClick = () => {
    const token =
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("authToken");
    if (!token) {
      alert("로그인 후 이용해주세요.");
      navigate("/users/login");
      return;
    }
    navigate(`/surveys/${survey.surveyId}`);
  };

  return (
      <div
          className={`bg-white rounded-2xl shadow-md hover:shadow-xl border transition-all duration-200 p-6 flex flex-col justify-between h-full cursor-pointer
        ${
              hasParticipated
                  ? "border-blue-200"
                  : "border-[#E2D7C7] hover:border-[#B89369]"
          }`}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleClick();
          }}
      >
        {/* 상단: 포인트 + 상태 + 참여 여부 */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-500 mb-1">참여 보상</span>
            <span className="text-xl font-bold text-[#B89369]">
            {survey.reward.toLocaleString()}P
          </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div
                className={`px-3 py-1 rounded-full text-[11px] font-semibold ${daysLeft.badgeClass}`}
            >
              {daysLeft.text}
            </div>
            {hasParticipated && (
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              참여 완료
            </span>
            )}
          </div>
        </div>

        {/* 제목 */}
        <h3 className="text-base md:text-lg font-semibold text-[#3A2A1A] mb-4 line-clamp-2 min-h-[3rem]">
          {survey.title}
        </h3>

        {/* 참여율 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2 text-[11px] text-gray-600">
            <span>참여율</span>
            <span>
            {survey.responseCnt}/{survey.maxResponse}명 ({participationRate}%)
          </span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-300 ${
                    participationRate >= 80
                        ? "bg-[#B89369]"
                        : participationRate >= 50
                            ? "bg-[#D1A373]"
                            : "bg-gray-400"
                }`}
                style={{ width: `${participationRate}%` }}
            />
          </div>
        </div>

        {/* 마감일 */}
        <div className="text-[11px] text-gray-500 text-right pt-3 border-t border-gray-100">
          마감일 {formatDeadline(survey.deadline)}
        </div>
      </div>
  );
}

export default HomePageComponent;
