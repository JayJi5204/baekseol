// components/admin/GraphChart.tsx
import { useState, useEffect } from "react";
import { getPointGraph } from "../../api/SurveyApi";
import type { GraphResponseDto } from "../../types/SurveyData";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// 라인 차트 옵션: 좌/우 두 개의 Y축 사용
const options: ChartOptions<"line"> = {
    responsive: true,
    interaction: {
        mode: "index",
        intersect: false,
    },
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: false,
        },
    },
    scales: {
        // 왼쪽 Y축: 사용자/포인트 지표
        y: {
            type: "linear",
            position: "left",
            beginAtZero: true,
        },
        // 오른쪽 Y축: 플랫폼 수익 (값이 큼)
        y1: {
            type: "linear",
            position: "right",
            beginAtZero: true,
            grid: {
                drawOnChartArea: false, // 격자 중복 방지
            },
        },
    },
};

const GraphChart = () => {
    const [interval, setInterval] = useState<"daily" | "weekly" | "monthly">("daily");
    const [graphData, setGraphData] = useState<GraphResponseDto | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGraph();
    }, [interval]);

    const fetchGraph = async () => {
        setLoading(true);
        try {
            const response = await getPointGraph(interval);
            setGraphData(response.data);
        } catch (error) {
            console.error("그래프 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: graphData?.labels || [],
        datasets: [
            {
                label: "신규 가입자",
                data: graphData?.newUsersSeries || [],
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                yAxisID: "y", // 기본 왼쪽 축
            },
            {
                label: "활성 사용자",
                data: graphData?.activeUsersSeries || [],
                borderColor: "rgb(153, 102, 255)",
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                yAxisID: "y",
            },
            {
                label: "포인트 발행",
                data: graphData?.pointsIssuedSeries || [],
                borderColor: "rgb(255, 159, 64)",
                backgroundColor: "rgba(255, 159, 64, 0.2)",
                yAxisID: "y",
            },
            {
                label: "포인트 사용",
                data: graphData?.pointsUsedSeries || [],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                yAxisID: "y",
            },
            {
                label: "플랫폼 수익",
                data: graphData?.revenueSeries || [],
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                yAxisID: "y1", // 오른쪽 축
            },
        ],
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">통계 그래프</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setInterval("daily")}
                        className={`px-4 py-2 rounded ${
                            interval === "daily" ? "bg-[#B89369] text-white" : "bg-gray-200"
                        }`}
                    >
                        일간
                    </button>
                    <button
                        onClick={() => setInterval("weekly")}
                        className={`px-4 py-2 rounded ${
                            interval === "weekly" ? "bg-[#B89369] text-white" : "bg-gray-200"
                        }`}
                    >
                        주간
                    </button>
                    <button
                        onClick={() => setInterval("monthly")}
                        className={`px-4 py-2 rounded ${
                            interval === "monthly" ? "bg-[#B89369] text-white" : "bg-gray-200"
                        }`}
                    >
                        월간
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">로딩 중...</div>
            ) : graphData ? (
                <Line data={chartData} options={options} />
            ) : (
                <div className="text-center py-8 text-gray-500">데이터가 없습니다.</div>
            )}
        </div>
    );
};

export default GraphChart;
