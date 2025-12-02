// SurveyMyPage.tsx
import { useState, useEffect } from "react";
import type {
  SurveyItemResDto,
  SurveyRefundPreviewResponse,
} from "../../types/SurveyData";
import {
  getMySurveys,
  closeSurvey,
  getSurveyRefundPreview,
} from "../../api/SurveyApi";
import SurveyMyList from "../../components/survey/SurveyMyList";
import RefundPreviewModal from "../../components/survey/RefundPreviewModal";
import { Link, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";

const ITEMS_PER_PAGE = 10;

function SurveyMyPage() {
  const [allSurveys, setAllSurveys] = useState<SurveyItemResDto[]>([]);
  const [displayedSurveys, setDisplayedSurveys] = useState<SurveyItemResDto[]>(
    []
  );
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 환불 미리보기 모달 상태
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [selectedSurveyTitle, setSelectedSurveyTitle] = useState<string>("");
  const [preview, setPreview] = useState<SurveyRefundPreviewResponse | null>(
    null
  );
  const [isClosing, setIsClosing] = useState(false);

  // URL query parameter 관리
  const [searchParams, setSearchParams] = useSearchParams();

  // 설문 목록 조회 함수 (재사용 가능하도록 분리)
  const fetchMySurveys = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMySurveys();

      if (
        response?.data?.surveyItems &&
        Array.isArray(response.data.surveyItems)
      ) {
        setAllSurveys(response.data.surveyItems);
        setDisplayedSurveys(response.data.surveyItems.slice(0, displayCount));
      } else {
        console.error("예상치 못한 응답 구조:", response);
        setAllSurveys([]);
        setDisplayedSurveys([]);
      }
    } catch (err) {
      console.error("내 설문 조회 오류:", err);
      setError("설문을 불러오는 중 오류가 발생했습니다.");
      setAllSurveys([]);
      setDisplayedSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 확인 후 돌아왔을 때 처리
  useEffect(() => {
    const action = searchParams.get("action");
    const surveyId = searchParams.get("surveyId");
    const surveyTitle = searchParams.get("title");

    if (action === "closeSurvey" && surveyId && surveyTitle) {
      // query parameter 즉시 제거 (중복 실행 방지)
      searchParams.delete("action");
      searchParams.delete("surveyId");
      searchParams.delete("title");
      setSearchParams(searchParams, { replace: true });

      // 환불 미리보기 데이터 조회 후 모달 열기
      handleOpenRefundPreview(
        Number(surveyId),
        decodeURIComponent(surveyTitle)
      );
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    fetchMySurveys();
  }, []);

  // displayCount가 변경될 때 displayedSurveys 업데이트
  useEffect(() => {
    setDisplayedSurveys(allSurveys.slice(0, displayCount));
  }, [allSurveys, displayCount]);

  // 환불 미리보기 모달 열기
  const handleOpenRefundPreview = async (surveyId: number, title: string) => {
    try {
      const res = await getSurveyRefundPreview(surveyId);
      setPreview(res.data);
      setSelectedSurveyId(surveyId);
      setSelectedSurveyTitle(title);
      setIsRefundModalOpen(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.message ?? "...");
      }
    }
  };

  // 실제 설문 내리기 실행
  const handleConfirmCloseSurvey = async () => {
    if (!selectedSurveyId) return;
    setIsClosing(true);

    try {
      await closeSurvey(selectedSurveyId);
      alert("설문이 성공적으로 마감되었습니다.");
      handleCancelCloseSurvey();
      fetchMySurveys();
    } catch (error) {
      console.error("설문 마감 실패:", error);
      alert("설문 마감에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsClosing(false);
    }
  };

  // 모달 닫기 및 상태 초기화
  const handleCancelCloseSurvey = () => {
    setIsRefundModalOpen(false);
    setPreview(null);
    setSelectedSurveyId(null);
    setSelectedSurveyTitle("");
  };

  const handleLoadMore = () => {
    const newDisplayCount = displayCount + ITEMS_PER_PAGE;
    setDisplayCount(newDisplayCount);
  };

  const hasMore = displayCount < allSurveys.length;

  // 통계 계산
  const inProgressCount = allSurveys.filter(
    (s) => s.state === "IN_PROCESS"
  ).length;
  const notInProgressCount = allSurveys.filter(
    (s) => s.state === "DONE" || s.state === "CANCELED"
  ).length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89369]"></div>
          <div className="text-lg text-[#B89369]">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <div className="text-red-600 font-medium">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#B89369] mb-2">
              내가 의뢰한 설문
            </h1>
            <p className="text-gray-600">
              등록한 설문을 관리하고 참여 현황을 확인하세요
            </p>
          </div>
          <Link to="/surveys/create">
            <button className="px-6 py-3 bg-[#B89369] text-white rounded-lg hover:bg-[#A67F5C] transition-colors font-medium shadow-sm hover:shadow-md flex items-center gap-2 whitespace-nowrap">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              설문 등록
            </button>
          </Link>
        </div>

        {/* 통계 카드 */}
        {allSurveys.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-[#B89369]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">전체 설문</p>
                  <p className="text-2xl font-bold text-[#B89369]">
                    {allSurveys.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#B89369]/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#B89369]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-[#B89369]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">진행중</p>
                  <p className="text-2xl font-bold text-green-600">
                    {inProgressCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-[#B89369]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">마감</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {notInProgressCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 설문 목록 */}
      {allSurveys.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-[#B89369]/20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-[#B89369]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-[#B89369]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#B89369] mb-2">
              의뢰한 설문이 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              새로운 설문을 등록하고 응답을 수집해보세요
            </p>
            <Link to="/surveys/create">
              <button className="px-6 py-3 bg-[#B89369] text-white rounded-lg hover:bg-[#A67F5C] transition-colors font-medium inline-flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                첫 설문 만들기
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* 테이블 헤더 */}
          <div className="bg-white rounded-t-lg shadow-sm border border-[#B89369]/20">
            <div className="hidden md:grid md:grid-cols-12 bg-[#F3F1E5] border-b border-[#B89369]/20 font-semibold text-sm text-[#B89369]">
              <div className="col-span-3 px-6 py-4">제목</div>
              <div className="col-span-2 px-6 py-4 text-center">상태</div>
              <div className="col-span-2 px-6 py-4 text-center">참여 현황</div>
              <div className="col-span-2 px-6 py-4 text-center">생성일</div>
              <div className="col-span-2 px-6 py-4 text-center">마감일</div>
              <div className="col-span-1 px-6 py-4 text-center">관리</div>
            </div>
            <SurveyMyList
              surveys={displayedSurveys}
              onSurveyUpdated={fetchMySurveys}
            />
          </div>

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="group px-8 py-3 bg-white text-[#B89369] border border-[#B89369]/30 rounded-lg hover:bg-[#F3F1E5] transition-all font-medium shadow-sm hover:shadow flex items-center gap-3"
              >
                <span>더보기</span>
                <span className="text-sm text-gray-500">
                  ({displayedSurveys.length} / {allSurveys.length})
                </span>
                <svg
                  className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}

      {/* 환불 미리보기 모달 */}
      <RefundPreviewModal
        open={isRefundModalOpen}
        surveyTitle={selectedSurveyTitle}
        preview={preview}
        loading={isClosing}
        onConfirm={handleConfirmCloseSurvey}
        onCancel={handleCancelCloseSurvey}
      />
    </div>
  );
}

export default SurveyMyPage;
