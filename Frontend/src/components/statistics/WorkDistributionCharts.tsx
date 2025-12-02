// src/pages/survey/components/WorkDistribution.tsx
import { AgCharts } from 'ag-charts-react';
import type { AgChartOptions } from 'ag-charts-community';
import type { DistributionItem } from '../../types/Statistics.ts';

interface WorkDistributionProps {
    workDistribution: DistributionItem[];
}

// 직업 라벨 매핑
const JOB_LABELS: Record<string, string> = {
    IT: 'IT',
    OFFICE: '사무직',
    MANUFACTURING: '제조업',
    SERVICE: '서비스업',
    EDUCATION: '교육',
    MEDICAL: '의료',
    CREATIVE: '창작',
    STUDENT: '학생',
    SELF_EMPLOYED: '자영업',
    ETC: '기타',
};

const BAR_COLORS = [
    '#B89369', // 모카 브라운
    '#8B5A2B', // 딥 브라운
    '#CDA876', // 라이트 모카
    '#A0703B', // 웜 브라운
    '#E0C097', // 베이지
    '#9C6F43', // 카라멜
    '#D3B38C', // 소프트 베이지
    '#6B4423', // 다크 초콜릿
    '#E5C39E', // 크림 베이지
    '#AF7A4C', // 코퍼 브라운
];

export default function WorkDistribution({ workDistribution }: WorkDistributionProps) {
    const jobData =
        workDistribution?.map((item) => ({
            job: JOB_LABELS[item.label] ?? item.label,
            count: item.count,
            code: item.label,
        })) ?? [];

    const totalCount = jobData.reduce((sum, d) => sum + d.count, 0);

    const jobChartOptions: AgChartOptions = {
        data: jobData,
        series: [
            {
                type: 'bar',
                direction: 'horizontal',
                xKey: 'job',
                yKey: 'count',
                cornerRadius: 6,
                strokeWidth: 0,

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                itemStyler: ({ datum, highlighted }: any) => {
                    const idx = jobData.findIndex((d) => d.job === datum.job);
                    const baseColor = BAR_COLORS[idx % BAR_COLORS.length];

                    return {
                        fill: baseColor,
                        stroke: baseColor,
                        fillOpacity: highlighted ? 1 : 0.9,
                    };
                },

                tooltip: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    renderer: ({ datum, yKey }: any) => {
                        const job = datum.job;
                        const count = datum[yKey];
                        const idx = jobData.findIndex((d) => d.job === job);
                        const color = BAR_COLORS[idx % BAR_COLORS.length];
                        const percentage =
                            totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0';

                        return `
              <div style="padding: 8px 12px; font-family: system-ui, -apple-system, sans-serif;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                  <div style="width:12px;height:12px;border-radius:2px;background:${color};"></div>
                  <span style="font-weight:600;color:#342512;font-size:14px;">${job}</span>
                </div>
                <div style="color:#666;font-size:13px;padding-left:20px;">
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
            } as never,
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        axes: [
            {
                type: 'category',
                position: 'left',
                label: {
                    color: '#342512',
                    fontSize: 12,
                    fontWeight: 'bold',
                },
                bandHighlight: {
                    enabled: true,
                },
            },
            {
                type: 'number',
                position: 'bottom',
                label: {
                    enabled: true,
                    color: '#888',
                    fontSize: 11,

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter: (params: any) =>
                        Number.isInteger(params.value) ? params.value.toString() : '',
                },
                gridLine: {
                    style: [
                        {
                            stroke: '#e0e0e0',
                            lineDash: [2, 2],
                            strokeWidth: 1,
                        },
                        {
                            strokeWidth: 0,
                        },
                    ],
                },
            },
        ] as never,
        legend: {
            enabled: false,
        },
        background: {
            fill: 'transparent',
        },
        padding: {
            top: 20,
            right: 16,
            bottom: 20,
            left: 80, // 직업명이 잘 보이도록 왼쪽 여유
        },
    };

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
                marginTop: '24px',
            }}
        >
            <h2
                style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    marginBottom: '16px',
                    color: '#342512',
                }}
            >
                직업 분포
            </h2>

            <div style={{ width: '100%'}}>
                {jobData.length === 0 ? (
                    <div
                        style={{
                            fontSize: 13,
                            color: '#999',
                            textAlign: 'center',
                        }}
                    >
                        직업 통계 데이터가 없습니다.
                    </div>
                ) : (
                    <AgCharts options={jobChartOptions} />
                )}
            </div>
        </div>
    );
}
