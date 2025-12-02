// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  surveyTop10Deadline,
  surveyTop10Point,
  surveyTop10ResponseCnt,
  getSurveyByRecommend,
  checkParticipation,
} from "../api/SurveyApi";
import BannerSection from "../components/hompage/BannerSection";
import SurveySection from "../components/hompage/SurveySection";
import type { SurveyItemResDto } from "../types/SurveyData";

interface UserInfo {
  isLoggedIn: boolean;
  username?: string;
}

function HomePage() {
  const [deadlineSurveys, setDeadlineSurveys] = useState<SurveyItemResDto[]>([]);
  const [pointSurveys, setPointSurveys] = useState<SurveyItemResDto[]>([]);
  const [responseCntSurveys, setResponseCntSurveys] = useState<SurveyItemResDto[]>([]);
  const [recommendSurveys, setRecommendSurveys] = useState<SurveyItemResDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo>({ isLoggedIn: false });
  const [participatedMap, setParticipatedMap] = useState<Record<number, boolean>>({});

  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    try {
      const token =
          sessionStorage.getItem("accessToken") ||
          localStorage.getItem("authToken");
      if (token) {
        setUserInfo({
          isLoggedIn: true,
          username: localStorage.getItem("username") || "사용자",
        });
      }
    } catch (e) {
      console.error("로그인 상태 확인 실패:", e);
    }
  }, []);

  // 마감 임박
  useEffect(() => {
    const fetchDeadline = async () => {
      try {
        const data = await surveyTop10Deadline();
        setDeadlineSurveys(data?.data?.surveyItems ?? []);
      } catch (e) {
        console.error("마감 임박 설문 조회 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDeadline();
  }, []);

  // 포인트 높은
  useEffect(() => {
    const fetchPoint = async () => {
      try {
        const data = await surveyTop10Point();
        setPointSurveys(data?.data?.surveyItems ?? []);
      } catch (e) {
        console.error("포인트 높은 설문 조회 실패:", e);
      }
    };
    fetchPoint();
  }, []);

  // 참여자 많은
  useEffect(() => {
    const fetchResponseCnt = async () => {
      try {
        const data = await surveyTop10ResponseCnt();
        setResponseCntSurveys(data?.data?.surveyItems ?? []);
      } catch (e) {
        console.error("참여자 많은 설문 조회 실패:", e);
      }
    };
    fetchResponseCnt();
  }, []);

  // 추천 (로그인 유저 전용)
  useEffect(() => {
    if (!userInfo.isLoggedIn) return;

    const fetchRecommend = async () => {
      try {
        const data = await getSurveyByRecommend();
        setRecommendSurveys(data?.data?.surveyItems ?? []);
      } catch (e) {
        console.error("추천 설문 조회 실패:", e);
      }
    };
    fetchRecommend();
  }, [userInfo.isLoggedIn]);

  // 참여 여부 일괄 조회
  useEffect(() => {
    if (!userInfo.isLoggedIn) return;

    const all: SurveyItemResDto[] = [
      ...deadlineSurveys,
      ...pointSurveys,
      ...responseCntSurveys,
      ...recommendSurveys,
    ];
    const uniqueIds = Array.from(new Set(all.map((s) => s.surveyId)));
    if (uniqueIds.length === 0) return;

    const fetchParticipationAll = async () => {
      try {
        const results = await Promise.all(
            uniqueIds.map((id) =>
                checkParticipation(id)
                    .then((res) => ({ id, value: res.data as boolean }))
                    .catch(() => ({ id, value: false }))
            )
        );
        const map: Record<number, boolean> = {};
        results.forEach(({ id, value }) => {
          map[id] = value;
        });
        setParticipatedMap(map);
      } catch (e) {
        console.error("참여 여부 일괄 조회 실패:", e);
      }
    };

    fetchParticipationAll();
  }, [
    userInfo.isLoggedIn,
    deadlineSurveys,
    pointSurveys,
    responseCntSurveys,
    recommendSurveys,
  ]);

  // 배너 버튼: 지금 시작하기
  const handleClickStart = () => {
    const token =
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("authToken");
    if (!token) {
      navigate("/users/login");
      return;
    }
    navigate("/surveys");
  };

  return (
      <div className="min-h-screen bg-[#F3F1E5]">
        <BannerSection onClickPrimary={handleClickStart} />

        <main className="max-w-7xl mx-auto px-6 md:px-8 py-16 space-y-20">
          {/* 추천 설문 */}
          {userInfo.isLoggedIn && (
              <section className="space-y-5">
                <header className="px-1">
                  <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#1F2A3C]">
                    {userInfo.username}님을 위한 추천 설문
                  </h2>
                  <p className="mt-2 text-sm text-[#4C607A]">
                    회원님의 관심사와 활동 이력을 기반으로 추천된 설문입니다.
                  </p>
                </header>

                <SurveySection
                    surveys={recommendSurveys}
                    loading={loading}
                    participatedMap={participatedMap}
                />
              </section>
          )}

          {/* 마감 임박 설문 */}
          <section className="space-y-5">
            <header className="px-1">
              <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#3A2418]">
                마감 임박 설문
              </h2>
              <p className="mt-2 text-sm text-[#6A4A38]">
                곧 마감되는 설문들을 한눈에 확인해 보세요.
              </p>
            </header>

            <SurveySection
                surveys={deadlineSurveys}
                loading={loading}
                participatedMap={participatedMap}
            />
          </section>

          {/* 참여자 많은 설문 */}
          <section className="space-y-5">
            <header className="px-1">
              <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#223427]">
                참여자 많은 설문
              </h2>
              <p className="mt-2 text-sm text-[#4C6450]">
                지금 가장 많이 참여되고 있는 설문입니다.
              </p>
            </header>

            <SurveySection
                surveys={responseCntSurveys}
                loading={loading}
                participatedMap={participatedMap}
            />
          </section>

          {/* 포인트 높은 설문 */}
          <section className="space-y-5">
            <header className="px-1">
              <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#241B3A]">
                포인트 높은 설문
              </h2>
              <p className="mt-2 text-sm text-[#554A70]">
                높은 보상을 받을 수 있는 설문만 모았습니다.
              </p>
            </header>

            <SurveySection
                surveys={pointSurveys}
                loading={loading}
                participatedMap={participatedMap}
            />
          </section>
        </main>
      </div>
  );
}

export default HomePage;
