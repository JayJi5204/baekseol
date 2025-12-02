// src/pages/survey/SurveyBoardPage.tsx
import { useState, useEffect } from "react";
import type {
  SortOption,
  SurveyItemResDto,
  SortType,
} from "../../types/SurveyData";
import { searchSurveys, checkParticipation } from "../../api/SurveyApi";
import SurveyList from "../../components/survey/SurveyList";
import SurveyPagination from "../../components/survey/SurveyPagination";
import SurveySort from "../../components/survey/SurveySort";

function SurveyBoardPage() {
  const [selectedSort, setSelectedSort] = useState<SortOption>("최신순");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [surveys, setSurveys] = useState<SurveyItemResDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [participatedMap, setParticipatedMap] = useState<
      Record<number, boolean>
  >({});
  const itemsPerPage = 20;

  const sortOptions: SortOption[] = [
    "최신순",
    "인기순",
    "마감임박순",
    "리워드많은순",
  ];

  const getSortType = (option: SortOption): SortType | undefined => {
    const sortMap: Record<SortOption, SortType> = {
      최신순: "LATEST",
      인기순: "POPULAR",
      마감임박순: "DEADLINE_NEAR",
      리워드많은순: "REWARD_HIGH",
    };
    return sortMap[option];
  };

  const fetchSurveys = async () => {
    setIsLoading(true);
    try {
      const response = await searchSurveys({
        sortType: getSortType(selectedSort),
        page: currentPage - 1,
        size: itemsPerPage,
      });

      if (response.data && response.data.content) {
        setSurveys(response.data.content);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      } else {
        console.error("예상치 못한 응답 구조:", response);
        setSurveys([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error("설문 목록 조회 실패:", error);
      setSurveys([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSort, currentPage]);

  // 이 페이지에서 보이는 설문들에 대한 참여 여부 조회
  useEffect(() => {
    const token =
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("authToken");
    if (!token || surveys.length === 0) {
      setParticipatedMap({});
      return;
    }

    const fetchParticipation = async () => {
      try {
        const results = await Promise.all(
            surveys.map((s) =>
                checkParticipation(s.surveyId)
                    .then((res) => ({ id: s.surveyId, value: res.data as boolean }))
                    .catch(() => ({ id: s.surveyId, value: false }))
            )
        );
        const map: Record<number, boolean> = {};
        results.forEach(({ id, value }) => {
          map[id] = value;
        });
        setParticipatedMap(map);
      } catch (e) {
        console.error("게시판 참여 여부 조회 실패:", e);
      }
    };

    fetchParticipation();
  }, [surveys]);

  const handleSortChange = (option: SortOption) => {
    setSelectedSort(option);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* 왼쪽 정렬 옵션 */}
          <SurveySort
              sortOptions={sortOptions}
              selectedSort={selectedSort}
              onSortChange={handleSortChange}
          />

          {/* 오른쪽 게시판 목록 */}
          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[#B89369] mb-2">
                설문 목록
              </h2>
              <p className="text-gray-600">
                현재 정렬:{" "}
                <strong className="text-[#B89369]">{selectedSort}</strong> | 전체{" "}
                <strong className="text-[#B89369]">{totalElements}</strong>개
              </p>
            </div>

            {/* 설문 목록: 참여 여부 맵 내려줌 */}
            <SurveyList
                surveys={surveys}
                isLoading={isLoading}
                participatedMapFromParent={participatedMap}
            />

            {/* 페이지네이션 */}
            <SurveyPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>
  );
}

export default SurveyBoardPage;
