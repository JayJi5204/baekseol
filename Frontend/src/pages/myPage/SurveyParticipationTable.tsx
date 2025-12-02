import { useEffect, useState } from "react";
import type { SurveyItemResDto } from "../../types/SurveyData";
import * as surveyApi from "../../api/SurveyApi";

interface Props {
  surveys?: SurveyItemResDto[] | null;
}

export const SurveyParticipationTable = ({
  surveys: initialSurveys,
}: Props) => {
  const [surveys, setSurveys] = useState<SurveyItemResDto[]>(
    initialSurveys ?? []
  );
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSurveys(page, size);
  }, [page]);

  const loadSurveys = async (page: number, size: number) => {
    setLoading(true);
    try {
      const res = await surveyApi.getSurveyParticipation(page, size);

      // ✅ 수정: res.data.content로 접근
      setSurveys(res.data.content ?? []);

      // ✅ 수정: 실제 totalPages 사용
      setTotalPages(res.data.totalPages ?? 1);
    } catch (error) {
      console.error("설문 조회 실패:", error);
      setSurveys([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {loading ? (
        <div className="text-center py-8 text-gray-500">로딩 중...</div>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F3EDE3]">
                <th className="py-3 px-4 text-[#B89369] font-bold text-center">
                  설문명
                </th>
                <th className="py-3 px-4 text-[#B89369] font-bold text-center">
                  보상
                </th>
                <th className="py-3 px-4 text-[#B89369] font-bold text-center">
                  날짜
                </th>
              </tr>
            </thead>
            <tbody>
              {!surveys || surveys.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-500">
                    참여한 설문이 없습니다
                  </td>
                </tr>
              ) : (
                surveys.map((item) => (
                  <tr
                    key={item.surveyId}
                    className="border-b border-gray-100 hover:bg-[#F9F7F3] transition"
                  >
                    <td className="py-3 px-4 text-gray-800 font-medium text-center">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-[#B89369] font-bold text-center">
                      {(item.reward ?? 0).toLocaleString()}P
                    </td>
                    <td className="py-3 px-4 text-gray-700 text-center">
                      {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              disabled={page <= 0}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#B89369] text-white hover:bg-[#A87E4F] disabled:bg-gray-200 disabled:text-gray-400"
            >
              이전
            </button>
            <span className="px-4 py-2 bg-[#F3EDE3] text-[#B89369] font-bold rounded-lg">
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#B89369] text-white hover:bg-[#A87E4F] disabled:bg-gray-200 disabled:text-gray-400"
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
};
