import { useState } from 'react';
import { AgCharts } from 'ag-charts-react';
import type { AgChartOptions } from 'ag-charts-community';

interface AgeData {
    label: string;
    count: number;
}

interface AgeDistributionChartProps {
    ageDistribution: AgeData[];
}

const AGE_LABELS: Record<string, string> = {
    TEEN: '10대',
    TWENTIES: '20대',
    THIRTIES: '30대',
    FORTIES: '40대',
    FIFTIES: '50대',
    SIXTY_PLUS: '60대 이상',
};

export default function AgeDistributionChart({ ageDistribution }: AgeDistributionChartProps) {
    const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');

    // 연령대 데이터 변환
    const ageData = ageDistribution.map((item) => ({
        age: AGE_LABELS[item.label] || item.label,
        count: item.count,
        label: item.label,
    }));

    const totalCount = ageData.reduce((sum, d) => sum + d.count, 0);

    // 갈색 계열 팔레트
    const colorPalette = [
        '#6B4423',
        '#8B5A2B',
        '#A0703B',
        '#B89369',
        '#CDA876',
        '#E0C097',
    ];

    const ageChartOptions: AgChartOptions = {
        data: ageData,
        series: [
            {
                type: 'bar',
                xKey: 'age',
                yKey: 'count',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                itemStyler: ({ datum, highlighted }: any) => {
                    const idx = ageData.findIndex((d) => d.age === datum.age);
                    const baseColor = colorPalette[idx % colorPalette.length] ?? colorPalette[0];

                    return {
                        fill: baseColor,
                        stroke: baseColor,
                        fillOpacity: highlighted ? 1 : 0.85,
                    };
                },
                tooltip: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    renderer: ({ datum, yKey }: any) => {
                        const age = datum.age;
                        const count = datum[yKey];
                        const percentage =
                            totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0';
                        const idx = ageData.findIndex((d) => d.age === age);
                        const color = colorPalette[idx % colorPalette.length];

                        return `
                            <div style="padding: 8px 12px; font-family: system-ui, -apple-system, sans-serif;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                    <div style="width: 12px; height: 12px; border-radius: 2px; background-color: ${color};"></div>
                                    <span style="font-weight: 600; color: #342512; font-size: 14px;">${age}</span>
                                </div>
                                <div style="color: #666; font-size: 13px; padding-left: 20px;">
                                    ${count.toLocaleString()}명 (${percentage}%)
                                </div>
                            </div>
                        `;
                    },
                },
                highlightStyle: {
                    item: {
                        fillOpacity: 1,
                    },
                },
            } as any,
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        axes: [
            {
                type: 'category',
                position: 'bottom',
                label: {
                    color: '#342512',
                    fontSize: 13,
                    fontWeight: 'bold',
                },
            },
            {
                type: 'number',
                position: 'left',
                label: {
                    enabled: true,
                    color: '#888',
                    fontSize: 11,
                },
                gridLine: {
                    enabled: true,
                    style: [
                        {
                            stroke: '#e0e0e0',
                            lineDash: [4, 4],
                            strokeWidth: 1,
                        },
                    ],
                },
            },
        ] as any,
        legend: {
            enabled: false,
        },
        background: {
            fill: 'transparent',
        },
        padding: {
            top: 20,
            right: 10,
            bottom: 10,
            left: 10,
        },
    };

    const isChartMode = viewMode === 'chart';

    return (
        <div
            style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e8e8e8',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 20px)',
            }}
        >
            {/* 제목 + 우측 상단 토글 스위치 */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                }}
            >
                <h2
                    style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#342512',
                        margin: 0,
                    }}
                >
                    연령 분포
                </h2>

                <button
                    type="button"
                    onClick={() =>
                        setViewMode((prev) => (prev === 'chart' ? 'list' : 'chart'))
                    }
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 6px',
                        borderRadius: '999px',
                        border: '1px solid #d0c4b5',
                        backgroundColor: '#f8f5f1',
                        cursor: 'pointer',
                        fontSize: '11px',
                        gap: '4px',
                    }}
                >
                    <span
                        style={{
                            padding: '2px 6px',
                            borderRadius: '999px',
                            backgroundColor: isChartMode ? '#B89369' : 'transparent',
                            color: isChartMode ? '#fff' : '#8a7a64',
                            fontWeight: isChartMode ? 700 : 500,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        차트
                    </span>
                    <span
                        style={{
                            padding: '2px 6px',
                            borderRadius: '999px',
                            backgroundColor: !isChartMode ? '#B89369' : 'transparent',
                            color: !isChartMode ? '#fff' : '#8a7a64',
                            fontWeight: !isChartMode ? 700 : 500,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        목록
                    </span>
                </button>
            </div>

            <div style={{ width: '100%', height: 280 }}>
                {isChartMode ? (
                    // ===== 차트 모드 =====
                    <AgCharts options={ageChartOptions} />
                ) : (
                    // ===== 목록 모드 =====
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            overflowY: 'auto',
                            padding: '4px 2px 0',
                        }}
                    >
                        {ageData.length === 0 ? (
                            <div
                                style={{
                                    fontSize: 13,
                                    color: '#999',
                                    textAlign: 'center',
                                    padding: '24px 0',
                                }}
                            >
                                연령 통계 데이터가 없습니다.
                            </div>
                        ) : (
                            <>
                                {ageData.map((item) => (
                                    <div
                                        key={item.label}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 4px',
                                            borderBottom: '1px solid #f1ece6',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 999,
                                                    backgroundColor:
                                                        colorPalette[
                                                        ageData.findIndex(
                                                            (d) => d.label === item.label,
                                                        ) % colorPalette.length
                                                            ],
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    color: '#342512',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.age}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 13,
                                                color: '#555',
                                            }}
                                        >
                                            {item.count.toLocaleString()}명
                                        </div>
                                    </div>
                                ))}

                                {/* 총합 */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '10px 4px 4px',
                                        marginTop: 4,
                                        borderTop: '1px solid #e5ddd2',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: '#342512',
                                    }}
                                >
                                    <span>총 응답자</span>
                                    <span>{totalCount.toLocaleString()}명</span>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
