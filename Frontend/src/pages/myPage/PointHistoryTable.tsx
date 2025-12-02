import { useState, useEffect } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import useZustandUser from "../../zstore/useZustandUser";
import * as paymentApi from "../../api/PaymentApi";
import type {
  PointHistoryResponse,
  PaymentResponse,
  WithdrawalResponse,
} from "../../types/Payment";

type FilterType = "ALL" | "GET" | "USE";
type SortType = "DATE_DESC" | "DATE_ASC" | "AMOUNT_DESC" | "AMOUNT_ASC";

const banks: { [key: string]: string } = {
  "004": "국민은행",
  "011": "농협은행",
  "020": "우리은행",
  "088": "신한은행",
  "105": "하나은행",
  "090": "카카오뱅크",
  "098": "토스뱅크",
};

const PointHistoryPage: FC = () => {
  const navigate = useNavigate();
  const { user } = useZustandUser();
  const [history, setHistory] = useState<PointHistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [sort, setSort] = useState<SortType>("DATE_DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<
      PaymentResponse | WithdrawalResponse | null
  >(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) {
      navigate("/users/login");
      return;
    }
    fetchHistory();
  }, [user, navigate]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await paymentApi.getPointHistory();
      setHistory(data);
    } catch (error) {
      console.error("포인트 내역 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const canExpand = (item: PointHistoryResponse) =>
      (item.referenceType === "PAYMENT" || item.referenceType === "WITHDRAWAL") &&
      !!item.referenceId;

  const handleDetailClick = async (item: PointHistoryResponse) => {
    if (expandedId === item.pointRecordId) {
      setExpandedId(null);
      setDetailData(null);
      return;
    }
    if (!canExpand(item)) {
      setExpandedId(null);
      setDetailData(null);
      return;
    }
    setExpandedId(item.pointRecordId);
    setDetailLoading(true);

    try {
      if (item.referenceType === "PAYMENT") {
        const paymentDetail = await paymentApi.getPaymentDetail(
            item.referenceId!
        );
        setDetailData(paymentDetail);
      } else if (item.referenceType === "WITHDRAWAL") {
        const withdrawalDetail = await paymentApi.getWithdrawalDetail(
            item.referenceId!
        );
        setDetailData(withdrawalDetail);
      }
    } catch (error) {
      console.error("상세 정보 조회 실패:", error);
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredHistory = history.filter((item) =>
      filter === "ALL" ? true : item.type === filter
  );

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sort) {
      case "DATE_DESC":
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "DATE_ASC":
        return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "AMOUNT_DESC":
        return b.amount - a.amount;
      case "AMOUNT_ASC":
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = sortedHistory.slice(
      startIndex,
      startIndex + itemsPerPage
  );

  const getTypeDisplay = (type: string) => {
    return type === "GET"
        ? { text: "충전", color: "text-green-600", bg: "bg-green-50", icon: "↑" }
        : { text: "사용", color: "text-red-600", bg: "bg-red-50", icon: "↓" };
  };

  const getBankName = (code: string): string => {
    return banks[code] || code;
  };

  const getStatusDisplay = (
      status: string
  ): { text: string; color: string } => {
    switch (status) {
      case "COMPLETED":
      case "CONFIRMED":
        return { text: "완료", color: "text-[#6989B8]" };
      case "PROCESSING":
      case "PENDING":
        return { text: "처리중", color: "text-[#B89369]" };
      case "FAILED":
        return { text: "실패", color: "text-gray-500" };
      default:
        return { text: "대기중", color: "text-gray-400" };
    }
  };

  if (!user) {
    return (
        <div className="flex items-center justify-center min-h-screen text-gray-600">
          로그인 후 이용할 수 있습니다.
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F7F3] to-[#F3EDE3] px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#B89369] mb-2">
                  유형
                </label>
                <div className="flex gap-2">
                  <button
                      onClick={() => {
                        setFilter("ALL");
                        setCurrentPage(1);
                      }}
                      className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                          filter === "ALL"
                              ? "bg-[#B89369] text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    전체
                  </button>
                  <button
                      onClick={() => {
                        setFilter("GET");
                        setCurrentPage(1);
                      }}
                      className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                          filter === "GET"
                              ? "bg-[#B89369] text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    충전
                  </button>
                  <button
                      onClick={() => {
                        setFilter("USE");
                        setCurrentPage(1);
                      }}
                      className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                          filter === "USE"
                              ? "bg-[#B89369] text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    사용
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#B89369] mb-2">
                  정렬
                </label>
                <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as SortType);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B89369]"
                >
                  <option value="DATE_DESC">최신순</option>
                  <option value="DATE_ASC">오래된순</option>
                  <option value="AMOUNT_DESC">금액 높은순</option>
                  <option value="AMOUNT_ASC">금액 낮은순</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#B89369]">
                내역 ({sortedHistory.length}건)
              </h2>
            </div>

            {isLoading ? (
                <p className="text-gray-500 text-center py-8">로딩 중...</p>
            ) : paginatedHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  포인트 내역이 없습니다
                </p>
            ) : (
                <div className="space-y-3">
                  {paginatedHistory.map((item) => {
                    const typeDisplay = getTypeDisplay(item.type);
                    const hasDetail = canExpand(item);
                    const isExpanded = expandedId === item.pointRecordId;

                    return (
                        <div
                            key={item.pointRecordId}
                            className="border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${typeDisplay.bg} ${typeDisplay.color}`}
                            >
                              {typeDisplay.icon} {typeDisplay.text}
                            </span>
                                </div>
                                <p className="text-gray-800 font-medium text-base mb-1">
                                  {item.content}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(item.createdAt).toLocaleString("ko-KR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                    className={`text-xl font-bold ${
                                        item.type === "GET"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                  {item.type === "GET" ? "+" : "-"}
                                  {(item.amount ?? 0).toLocaleString()}P
                                </p>
                                {item.platformFee != null && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      (수수료: {item.platformFee.toLocaleString()}원)
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  잔액: {(item.remainPoint ?? 0).toLocaleString()}P
                                </p>
                              </div>
                            </div>
                            {hasDetail && (
                                <button
                                    className="mt-3 px-3 py-2 rounded-lg bg-[#B89369] text-white text-xs font-semibold hover:bg-[#A87E4F] transition"
                                    onClick={() => handleDetailClick(item)}
                                >
                                  {isExpanded ? "닫기" : "상세보기"}
                                </button>
                            )}
                          </div>
                          {isExpanded && (
                              <div className="border-t border-gray-200 bg-[#F9F7F3] p-4">
                                {detailLoading ? (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                      로딩 중...
                                    </p>
                                ) : detailData ? (
                                    <div className="space-y-2">
                                      {item.referenceType === "PAYMENT" && (
                                          <>
                                            <div className="flex justify-between py-1">
                                  <span className="text-gray-600 text-sm">
                                    결제 수단
                                  </span>
                                              <span className="font-medium text-gray-800 text-sm">
                                    {(detailData as PaymentResponse).method ||
                                        "카드"}
                                  </span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                  <span className="text-gray-600 text-sm">
                                    결제 금액
                                  </span>
                                              <span className="font-bold text-green-600">
                                    {(
                                        (detailData as PaymentResponse).amount ??
                                        0
                                    ).toLocaleString()}
                                                원
                                  </span>
                                            </div>
                                            {item.platformFee != null && (
                                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600 text-sm">
                                      결제 수수료
                                    </span>
                                                  <span className="font-medium text-gray-600 text-sm">
                                                    {item.platformFee.toLocaleString()}
                                                    원
                                    </span>
                                                </div>
                                            )}
                                            {(detailData as PaymentResponse).approvalAt && (
                                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600 text-sm">
                                      승인 시각
                                    </span>
                                                  <span className="font-medium text-gray-800 text-sm">
                                      {new Date(
                                          (detailData as PaymentResponse)
                                              .approvalAt!
                                      ).toLocaleString("ko-KR", {
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between py-1">
                                  <span className="text-gray-600 text-sm">
                                    상태
                                  </span>
                                              <span
                                                  className={`font-semibold text-sm ${
                                                      getStatusDisplay(
                                                          (detailData as PaymentResponse).status
                                                      ).color
                                                  }`}
                                              >
                                    {
                                      getStatusDisplay(
                                          (detailData as PaymentResponse).status
                                      ).text
                                    }
                                  </span>
                                            </div>
                                          </>
                                      )}
                                      {item.referenceType === "WITHDRAWAL" && (
                                          <>
                                            <div className="flex justify-between py-1">
                                  <span className="text-gray-600 text-sm">
                                    은행
                                  </span>
                                              <span className="font-medium text-gray-800 text-sm">
                                    {getBankName(
                                        (
                                            detailData as WithdrawalResponse
                                        ).bankCode
                                    )}
                                  </span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                  <span className="text-gray-600 text-sm">
                                    계좌번호
                                  </span>
                                              <span className="font-medium text-gray-800 font-mono text-sm">
                                    {(detailData as WithdrawalResponse)
                                        .maskedAccount || "-"}
                                  </span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                  <span className="text-gray-600 text-sm">
                                    최종 금액
                                  </span>
                                              <span className="font-bold text-red-600">

                                                {(() => {
                                                  const w =
                                                      detailData as WithdrawalResponse;
                                                  const amount = w.amount ?? 0;
                                                  const fee = item.platformFee ?? 0;
                                                  const net = Math.max(0, amount - fee);
                                                  return net.toLocaleString();
                                                })()}
                                                원
                                  </span>
                                            </div>
                                            {item.platformFee != null && (
                                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600 text-sm">
                                      송금 수수료
                                    </span>
                                                  <span className="font-medium text-gray-600 text-sm">
                                                    {item.platformFee.toLocaleString()}
                                                    원
                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between py-1">
                                  <span className="text-gray-600 text-sm">
                                    신청 시각
                                  </span>
                                              <span className="font-medium text-gray-800 text-sm">
                                    {new Date(
                                        (
                                            detailData as WithdrawalResponse
                                        ).requestedAt
                                    ).toLocaleString("ko-KR", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                            </div>
                                            {(detailData as WithdrawalResponse)
                                                .completedAt && (
                                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600 text-sm">
                                      완료 시각
                                    </span>
                                                  <span className="font-medium text-gray-800 text-sm">
                                      {new Date(
                                          (
                                              detailData as WithdrawalResponse
                                          ).completedAt!
                                      ).toLocaleString("ko-KR", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between py-1">
                                  <span className="text-gray-600 text-sm">
                                    상태
                                  </span>
                                              <span
                                                  className={`font-semibold text-sm ${
                                                      getStatusDisplay(
                                                          (detailData as WithdrawalResponse)
                                                              .status
                                                      ).color
                                                  }`}
                                              >
                                    {
                                      getStatusDisplay(
                                          (detailData as WithdrawalResponse)
                                              .status
                                      ).text
                                    }
                                  </span>
                                            </div>
                                          </>
                                      )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                      상세 정보를 불러올 수 없습니다
                                    </p>
                                )}
                              </div>
                          )}
                        </div>
                    );
                  })}
                </div>
            )}
          </div>

          {totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex justify-center items-center gap-2">
                  <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg font-semibold transition-all bg-[#B89369] text-white hover:bg-[#A87E4F] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) page = i + 1;
                    else if (currentPage <= 3) page = i + 1;
                    else if (currentPage >= totalPages - 2)
                      page = totalPages - 4 + i;
                    else page = currentPage - 2 + i;

                    return (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                currentPage === page
                                    ? "bg-[#B89369] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          {page}
                        </button>
                    );
                  })}
                  <button
                      onClick={() =>
                          setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg font-semibold transition-all bg-[#B89369] text-white hover:bg-[#A87E4F] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  {currentPage} / {totalPages} 페이지
                </p>
              </div>
          )}
        </div>
      </div>
  );
};

export default PointHistoryPage;
