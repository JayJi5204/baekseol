// src/pages/survey/components/GenderDistributionChart.tsx
import { AgCharts } from 'ag-charts-react';
import type { AgChartOptions } from 'ag-charts-community';

interface GenderData {
    label: string;
    count: number;
}

interface GenderDistributionChartProps {
    genderDistribution: GenderData[];
}

const GENDER_COLORS = {
    MALE: "#3E445A",    // 차콜 블루
    FEMALE: "#E291A8",  // 핑크
};

export default function GenderDistributionChart({ genderDistribution }: GenderDistributionChartProps) {
    // 성별 데이터 - 순서 보장 (남성 먼저)
    const genderData = genderDistribution
        .sort((a) => (a.label === "MALE" ? -1 : 1))
        .map((item) => ({
            name: item.label === "MALE" ? "남성" : "여성",
            value: item.count,
            label: item.label,
        }));

    // 총 인원
    const totalGender = genderData.reduce((sum, d) => sum + d.value, 0);

    // AG Charts 도넛 차트 옵션
    const genderChartOptions: AgChartOptions = {
        data: genderData,
        series: [
            {
                type: "donut" as const,
                angleKey: "value",
                calloutLabelKey: "name",
                sectorLabelKey: "value",
                fills: genderData.map((d) => GENDER_COLORS[d.label as keyof typeof GENDER_COLORS]),
                strokes: ["#ffffff"],
                strokeWidth: 3,
                innerRadiusRatio: 0.65,
                outerRadiusRatio: 0.95,
                sectorSpacing: 3,
                calloutLabel: {
                    enabled: false,
                },
                sectorLabel: {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 16,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter: ({ datum, angleKey }: any) => {
                        const percentage = ((datum[angleKey] / totalGender) * 100).toFixed(0);
                        return `${percentage}%`;
                    },
                },
                innerLabels: [
                    {
                        text: totalGender.toLocaleString(),
                        fontSize: 32,
                        fontWeight: "bold",
                        color: "#342512",
                    },
                    {
                        text: "총 참여자",
                        fontSize: 14,
                        spacing: 8,
                        color: "#666",
                    },
                ],
                highlightStyle: {
                    item: {
                        strokeWidth: 0,
                    },
                    series: {
                        dimOpacity: 0.3,
                    },
                },
                tooltip: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    renderer: ({ datum, angleKey }: any) => {
                        const value = datum[angleKey];
                        const percentage = ((value / totalGender) * 100).toFixed(1);
                        const color = GENDER_COLORS[datum.label as keyof typeof GENDER_COLORS];

                        return `
                            <div style="padding: 8px 12px; font-family: system-ui, -apple-system, sans-serif;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                    <div style="width: 12px; height: 12px; border-radius: 2px; background-color: ${color};"></div>
                                    <span style="font-weight: 600; color: #342512; font-size: 14px;">${datum.name}</span>
                                </div>
                                <div style="color: #666; font-size: 13px; padding-left: 20px;">
                                    ${value.toLocaleString()}명 (${percentage}%)
                                </div>
                            </div>
                        `;
                    },
                },
                marker: {
                    enabled: true,
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any,
        ],
        legend: {
            enabled: false,
        },
        background: {
            fill: "transparent",
        },
        padding: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        },
    };

    return (
        <div
            style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #e8e8e8",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 20px)",
            }}
        >
            <h2
                style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    marginBottom: "16px",
                    color: "#342512",
                }}
            >
                성별 분포
            </h2>

            <div style={{ width: "100%", height: 280 }}>
                <AgCharts options={genderChartOptions} />
            </div>
        </div>
    );
}