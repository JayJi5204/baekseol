// pages/myPage/admin/AdminStatisticsPage.tsx
import { useEffect, useState } from "react";
import { getAdminStatistics } from "../../../api/SurveyApi";
import type { DailyStatisticsDTO } from "../../../types/SurveyData";
import StatCard from "../../../components/admin/StatCard";
import PointLogsTable from "../../../components/admin/PointLogsTable";
import GraphChart from "../../../components/admin/GraphChart";

const AdminStatisticsPage = () => {
    const [statDate, setStatDate] = useState(new Date().toISOString().slice(0, 10));
    const [statistics, setStatistics] = useState<DailyStatisticsDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchStatistics();
    }, [statDate]);

    const fetchStatistics = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getAdminStatistics(statDate);
            setStatistics(response.data);
            if (!response.data) {
                setError("조회하신 통계 정보가 존재하지 않습니다.");
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError("조회하신 통계 정보가 존재하지 않습니다.");
                setStatistics(null);
            } else {
                setError("통계 데이터를 불러오는데 실패했습니다.");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F1E5] p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* 헤더 */}
                <div>
                    <h1 className="text-4xl font-bold text-[#B89369] mb-4">통계 대시보드</h1>
                    <div className="flex items-center gap-4">
                        <label className="text-lg font-medium text-gray-700">조회 날짜:</label>
                        <input
                            type="date"
                            value={statDate}
                            onChange={(e) => setStatDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B89369] bg-white"
                        />
                    </div>
                </div>

                {loading && <div className="text-center text-xl text-gray-600">로딩 중...</div>}
                {error && <div className="text-center text-xl text-red-500">{error}</div>}

                {/* 주요 통계 */}
                {statistics && !loading && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">주요 통계</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="신규 사용자" value={statistics.newUsers} subtitle="오늘" />
                            <StatCard title="활성 사용자" value={statistics.activeUsers} subtitle="오늘" />
                            <StatCard title="총 발행 포인트" value={statistics.totalPointsIssued} />
                            <StatCard title="일일 발행 포인트" value={statistics.dailyPointsIssued} subtitle="오늘" />
                            <StatCard title="총 매출액" value={statistics.totalRevenue} />
                            <StatCard title="일일 매출액" value={statistics.dailyRevenue} subtitle="오늘" />
                        </div>
                    </section>
                )}

                {/* 그래프 독립 섹션 */}
                <section>
                    <GraphChart />
                </section>

                {/* 포인트 로그 테이블 */}
                <section>
                     <PointLogsTable />
                </section>
                {/* 상세 토글 버튼 */}
                <button
                    className="px-6 py-2 bg-[#B89369] text-white rounded hover:bg-[#A07D56]"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? "상세 통계 및 로그 닫기" : "상세 통계 및 로그 보기"}
                </button>

                {/* 상세 통계 및 로그 토글 영역 */}
                {showDetails && statistics && (
                    <section className="mt-6 space-y-10">
                        {/* 상세 통계 */}
                        <div>
                            {/* 사용자 통계 */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-3">사용자 통계</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatCard title="총 사용자 수" value={statistics.totalUsers} />
                                </div>
                            </div>

                            {/* 설문 통계 */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-3">설문 통계</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatCard title="총 설문 수" value={statistics.totalSurveys} />
                                    <StatCard title="활성 설문 수" value={statistics.activeSurveys} />
                                    <StatCard title="총 응답 수" value={statistics.totalResponses} />
                                    <StatCard title="일일 응답 수" value={statistics.dailyResponses} subtitle="오늘" />
                                </div>
                            </div>

                            {/* 포인트 상세 통계 */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-3">포인트 상세 통계</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatCard title="총 사용 포인트" value={statistics.totalPointsUsed} />
                                    <StatCard title="일일 사용 포인트" value={statistics.dailyPointsUsed} subtitle="오늘" />
                                    <StatCard title="현재 유통 포인트" value={statistics.currentCirculatingPoints} />
                                </div>
                            </div>

                            {/* 출금 통계 */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-3">출금 통계</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatCard title="총 출금 금액" value={statistics.totalWithdrawalAmount} />
                                    <StatCard title="일일 출금 금액" value={statistics.dailyWithdrawalAmount} subtitle="오늘" />
                                    <StatCard title="일일 출금 건수" value={statistics.dailyWithdrawalCount} subtitle="오늘" />
                                    <StatCard title="대기 중인 출금" value={statistics.pendingWithdrawalCount} />
                                    <StatCard title="실패한 출금" value={statistics.failedWithdrawalCount} />
                                </div>
                            </div>

                            {/* 매출 통계 */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3">매출 통계</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <StatCard title="총 결제 건수" value={statistics.totalPaymentCount} />
                                    <StatCard title="일일 결제 건수" value={statistics.dailyPaymentCount} subtitle="오늘" />
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default AdminStatisticsPage;
