import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useZustandUser from "../../zstore/useZustandUser";
import ProfileCard from "./ProfileCard";
import PointHistoryTable from "./PointHistoryTable";
import { SurveyParticipationTable } from "./SurveyParticipationTable";
import { PointPurchaseModal } from "../../components/payment/PointPurchaseModal";
import { WithdrawalModal } from "../../components/payment/WithdrawalModal";
import * as SurveyApi from "../../api/SurveyApi";
import type { SurveyItemResDto } from "../../types/SurveyData";

type TabType = "POINT" | "SURVEY";

const MyPage = () => {
  const navigate = useNavigate();
  const { user, loadUserInfo, refetchUser } = useZustandUser();
  const [activeTab, setActiveTab] = useState<TabType>("POINT");
  const [surveys, setSurveys] = useState<SurveyItemResDto[]>([]);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // ✅ 마운트 시 사용자 정보 다시 가져오기
  useEffect(() => {
    loadUserInfo();
  }, []);

  useEffect(() => {
    if (user === undefined) return;
    if (!user || user.id === 0) {
      navigate("/users/login");
      return;
    }
    fetchSurveys();
  }, [user, navigate]);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const open = params.get("open");

    if (open === "purchase") {
      setIsPurchaseModalOpen(true);
    } else if (open === "withdraw") {
      setIsWithdrawModalOpen(true);
    }
  }, [location.search]);

  const fetchSurveys = async () => {
    try {
      const res = await SurveyApi.getSurveyParticipation(0, 10);
      setSurveys(res.data.content ?? []);
    } catch {
      setSurveys([]);
    }
  };

  // ✅ 결제 모달 닫을 때 포인트 갱신
  const handlePurchaseClose = () => {
    setIsPurchaseModalOpen(false);
    refetchUser(); // 무조건 최신 포인트 다시 가져오기
    navigate("/mypage", { replace: true });
  };

  // ✅ 환전 모달 닫을 때 포인트 갱신
  const handleWithdrawClose = () => {
    setIsWithdrawModalOpen(false);
    refetchUser();
    navigate("/mypage", { replace: true });
  };

  if (user === undefined) {
    return null;
  }

  if (!user || user.id === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        로그인 후 이용할 수 있습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F7F3] to-[#F3EDE3] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ProfileCard />
        <div className="bg-white rounded-2xl shadow-lg px-6 py-4 my-8 flex gap-4 items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-2">보유 포인트</p>
            <span className="font-bold text-2xl text-[#B89369]">
              {user.points?.toLocaleString() || 0}P
            </span>
            <span className="ml-2 text-xs text-gray-400">1P=1원</span>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-[#6989B8] text-white font-semibold px-5 py-2 rounded-lg hover:bg-[#476490] transition"
              onClick={() =>
                navigate("/check/password?next=/mypage?open=purchase")
              }
            >
              결제
            </button>
            <button
              className="bg-[#B89369] text-white font-semibold px-5 py-2 rounded-lg hover:bg-[#A87E4F] transition"
              onClick={() =>
                navigate("/check/password?next=/mypage?open=withdraw")
              }
            >
              환급
            </button>
          </div>
          <PointPurchaseModal
            isOpen={isPurchaseModalOpen}
            onClose={handlePurchaseClose} // ✅ 닫을 때 포인트 갱신
          />
          <WithdrawalModal
            isOpen={isWithdrawModalOpen}
            onClose={handleWithdrawClose} // ✅ 닫을 때 포인트 갱신
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("POINT")}
            className={`flex-1 py-3 rounded-t-lg font-bold transition-all ${
              activeTab === "POINT"
                ? "bg-[#B89369] text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            포인트 사용내역
          </button>
          <button
            onClick={() => setActiveTab("SURVEY")}
            className={`flex-1 py-3 rounded-t-lg font-bold transition-all ${
              activeTab === "SURVEY"
                ? "bg-[#B89369] text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            참여한 설문
          </button>
        </div>
        {activeTab === "POINT" ? (
          <PointHistoryTable />
        ) : (
          <SurveyParticipationTable surveys={surveys} />
        )}
      </div>
    </div>
  );
};

export default MyPage;
