import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import BasicStatisticsTab from "../../components/statistics/BasicStatisticsTab";
import ObjectiveStatisticsTab from "../../components/statistics/ObjectiveStatisticsTab";
import SubjectiveStatisticsTab from "../../components/statistics/SubjectiveStatisticsTab";
import type { Question } from "../../types/Statistics.ts";
import type {
  SurveyDetailResDto,
  SurveyRefundPreviewResponse,
} from "../../types/SurveyData.ts";
import {
  getSurveyById,
  getSurveyRefundPreview,
  closeSurvey,
} from "../../api/SurveyApi.tsx";
import { questionApi } from "../../api/SurveyStatisticsApi.tsx";
import StatisticsSidebar from "../../components/statistics/StatisticsSideBar.tsx";
import SurveyHeader from "../../components/statistics/StatisticsHeader.tsx";
import RefundPreviewModal from "../../components/survey/RefundPreviewModal.tsx";
import { AxiosError } from "axios";

export default function SurveyStatisticsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = sessionStorage.getItem("accessToken");
  const [activeTab, setActiveTab] = useState<
    "basic" | "objective" | "subjective"
  >("basic");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [surveyInfo, setSurveyInfo] = useState<SurveyDetailResDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleQuestionNumber, setVisibleQuestionNumber] = useState<
    number | null
  >(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 정산 미리보기 모달 상태
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [preview, setPreview] = useState<SurveyRefundPreviewResponse | null>(
    null
  );
  const [isSettling, setIsSettling] = useState(false);

  if (!token) {
    return <Navigate to="/users/login" replace />;
  }

  if (!id) {
    return <div>잘못된 접근입니다.</div>;
  }

  // 비밀번호 확인 후 돌아왔을 때 정산 처리
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const action = searchParams.get("action");
    const surveyId = searchParams.get("surveyId");

    if (action === "settlement" && surveyId) {
      // query parameter 제거 (중복 실행 방지)
      searchParams.delete("action");
      searchParams.delete("surveyId");
      setSearchParams(searchParams, { replace: true });

      // 정산 미리보기 데이터 조회 후 모달 열기
      handleOpenSettlementPreview(Number(surveyId));
    }
  }, [searchParams, setSearchParams]);

  // 설문 정보 조회
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchSurveyInfo = async () => {
      try {
        const response = await getSurveyById(Number(id));
        setSurveyInfo(response.data);
      } catch (error) {
        console.error("설문 정보 조회 실패:", error);
      }
    };

    fetchSurveyInfo();
  }, [id]);

  // 질문 목록 조회
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await questionApi.getQuestionsBySurveyId(Number(id));
        setQuestions(response.data);
      } catch (error) {
        console.error("질문 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  // Intersection Observer로 현재 보이는 질문 추적
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const questionNumber = parseInt(
              entry.target.id.replace("question-", "")
            );
            setVisibleQuestionNumber(questionNumber);
          }
        });
      },
      {
        rootMargin: "-20% 0px -20% 0px",
        threshold: 0.5,
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // 질문 요소들에 observer 연결
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!observerRef.current) return;

    const questionElements = document.querySelectorAll('[id^="question-"]');
    questionElements.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      questionElements.forEach((el) => {
        observerRef.current?.unobserve(el);
      });
    };
  }, [activeTab, loading]);

  // 정산하기 버튼 클릭 핸들러 - 비밀번호 확인 페이지로 이동
  const handleSettlementClick = () => {
    if (!id) return;

    // 비밀번호 확인 후 돌아올 URL에 정산 정보 포함
    const returnUrl = `/surveys/${id}/statistics?action=settlement&surveyId=${id}`;

    navigate(`/users/check/password?next=${encodeURIComponent(returnUrl)}`);
  };

  // 정산 미리보기 모달 열기
  const handleOpenSettlementPreview = async (surveyId: number) => {
    try {
      const res = await getSurveyRefundPreview(surveyId);
      setPreview(res.data);
      setIsSettlementModalOpen(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.message ?? "...");
      }
    }
  };

  // 실제 정산 처리 실행
  const handleConfirmSettlement = async () => {
    if (!id) return;
    setIsSettling(true);

    try {
      await closeSurvey(Number(id));
      alert("설문이 성공적으로 마감되고 정산되었습니다.");
      handleCancelSettlement();

      // 설문 정보 새로고침
      const response = await getSurveyById(Number(id));
      setSurveyInfo(response.data);
    } catch (error) {
      console.error("정산 실패:", error);
      alert("정산에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSettling(false);
    }
  };

  // 모달 닫기 및 상태 초기화
  const handleCancelSettlement = () => {
    setIsSettlementModalOpen(false);
    setPreview(null);
  };

  // 타입별 질문 필터링
  const objectiveQuestions = questions.filter((q) => q.type !== "SUBJECTIVE");
  const subjectiveQuestions = questions.filter((q) => q.type === "SUBJECTIVE");

  // 질문 클릭 핸들러
  const handleQuestionClick = (questionNumber: number) => {
    setTimeout(() => {
      const element = document.getElementById(`question-${questionNumber}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  return (
    <div
      style={{
        backgroundColor: "#F3F1E5",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          backgroundColor: "white",
          minHeight: "100vh",
        }}
      >
        {/* 좌측 사이드바 */}
        <StatisticsSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          objectiveQuestions={objectiveQuestions}
          subjectiveQuestions={subjectiveQuestions}
          loading={loading}
          visibleQuestionNumber={visibleQuestionNumber}
          onQuestionClick={handleQuestionClick}
        />

        {/* 우측 메인 영역 */}
        <main
          style={{
            flex: 1,
            padding: "24px 32px",
          }}
        >
          {/* 헤더 영역 */}
          <SurveyHeader
            surveyInfo={surveyInfo}
            onSettlementClick={handleSettlementClick}
          />

          {/* 탭별 컨텐츠 */}
          <div>
            {activeTab === "basic" && (
              <BasicStatisticsTab surveyId={Number(id)} />
            )}
            {activeTab === "objective" && (
              <ObjectiveStatisticsTab surveyId={Number(id)} />
            )}
            {activeTab === "subjective" && (
              <SubjectiveStatisticsTab surveyId={Number(id)} />
            )}
          </div>
        </main>
      </div>

      {/* 정산 미리보기 모달 */}
      <RefundPreviewModal
        open={isSettlementModalOpen}
        surveyTitle={surveyInfo?.title || ""}
        preview={preview}
        loading={isSettling}
        onConfirm={handleConfirmSettlement}
        onCancel={handleCancelSettlement}
      />
    </div>
  );
}
