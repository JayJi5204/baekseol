import { AgCharts } from 'ag-charts-react';
import type { AgChartOptions } from 'ag-charts-community';
import type { ParticipantStatistics } from '../../types/Statistics';

interface ChoiceDistributionProps {
    distribution: ParticipantStatistics;
}

interface ChartData {
    label: string;
    value: number;
}

const AGE_LABELS: Record<string, string> = {
    'TEEN': '10대',
    'TWENTIES': '20대',
    'THIRTIES': '30대',
    'FORTIES': '40대',
    'FIFTIES': '50대',
    'SIXTY_PLUS': '60대 이상'
};

const WORK_LABELS: Record<string, string> = {
    'IT': 'IT',
    'OFFICE': '사무직',
    'MANUFACTURING': '제조업',
    'SERVICE': '서비스업',
    'EDUCATION': '교육',
    'MEDICAL': '의료',
    'CREATIVE': '창작',
    'STUDENT': '학생',
    'SELF_EMPLOYED': '자영업',
    'ETC': '기타'
};

const GENDER_COLORS: Record<string, string> = {
    '남성': '#3E445A',
    '여성': '#E291A8'
};

const PASTEL_COLORS = [
    '#B4D4E1',
    '#D4B4E1',
    '#E1C4B4',
    '#B4E1D4',
    '#E1D4B4',
    '#E1B4C4',
    '#C4E1B4',
    '#E1B4B4',
];

export default function ChoiceDistribution({ distribution }: ChoiceDistributionProps) {
    const genderData: ChartData[] = distribution.genderDistribution?.map(item => ({
        label: item.label === 'MALE' ? '남성' : '여성',
        value: item.count
    })) || [];

    const ageData: ChartData[] = distribution.ageDistribution?.map(item => ({
        label: AGE_LABELS[item.label] || item.label,
        value: item.count
    })) || [];

    const workData: ChartData[] = distribution.workDistribution?.map(item => ({
        label: WORK_LABELS[item.label] || item.label,
        value: item.count
    })) || [];

    // 전체 데이터가 없는지 체크
    const hasNoData = genderData.length === 0 && ageData.length === 0 && workData.length === 0;

    const createDonutChartOptions = (data: ChartData[], chartType: 'gender' | 'age' | 'work', categoryName: string): AgChartOptions => {
        const total = data.reduce((sum, d) => sum + d.value, 0);

        let colors: string[];
        if (chartType === 'gender') {
            colors = data.map(d => GENDER_COLORS[d.label]);
        } else {
            colors = PASTEL_COLORS;
        }

        return {
            data: data,
            series: [
                {
                    type: 'donut',
                    angleKey: 'value',
                    fills: colors,
                    strokes: ['#ffffff'],
                    strokeWidth: 2,
                    innerRadiusRatio: 0.5,
                    outerRadiusRatio: 0.7,
                    sectorSpacing: 2,
                    innerLabels: [
                        {
                            text: categoryName,
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#666',
                        },
                        {
                            text: `${total.toLocaleString()}명`,
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#342512',
                            spacing: 4,
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
                            const percentage = ((value / total) * 100).toFixed(1);

                            return `
                                <div style="padding: 6px 10px; font-family: system-ui, -apple-system, sans-serif;">
                                    <div style="font-weight: 600; color: #342512; font-size: 12px; margin-bottom: 2px;">
                                        ${datum.label}
                                    </div>
                                    <div style="color: #666; font-size: 11px;">
                                        ${value.toLocaleString()}명 (${percentage}%)
                                    </div>
                                </div>
                            `;
                        },
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any,
            ],
            legend: {
                enabled: false,
            },
            background: {
                fill: 'transparent',
            },
            padding: {
                top: 15,
                right: 15,
                bottom: 15,
                left: 15,
            },
        };
    };

    const cardStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e8e8e8',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 20px)',
    };

    // 데이터가 전부 없으면 전체 영역에 메시지 표시
    if (hasNoData) {
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '60px',
                borderRadius: '8px',
                border: '1px solid #e8e8e8',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                minHeight: '300px'
            }}>
                <img
                    src="/images/waiting.jpg"
                    alt="데이터 없음"
                    style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                    }}
                />
                <span style={{
                    fontSize: '16px',
                    color: '#666',
                    fontWeight: '500'
                }}>
                    데이터가 없습니다.
                </span>
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px'
        }}>
            <div style={cardStyle}>
                {genderData.length > 0 ? (
                    <div style={{ height: '260px', width: '100%' }}>
                        <AgCharts options={createDonutChartOptions(genderData, 'gender', '성별')} />
                    </div>
                ) : (
                    <div style={{
                        height: '260px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        color: '#999'
                    }}>
                        데이터 없음
                    </div>
                )}
            </div>

            <div style={cardStyle}>
                {ageData.length > 0 ? (
                    <div style={{ height: '260px', width: '100%' }}>
                        <AgCharts options={createDonutChartOptions(ageData, 'age', '연령')} />
                    </div>
                ) : (
                    <div style={{
                        height: '260px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        color: '#999'
                    }}>
                        데이터 없음
                    </div>
                )}
            </div>

            <div style={cardStyle}>
                {workData.length > 0 ? (
                    <div style={{ height: '260px', width: '100%' }}>
                        <AgCharts options={createDonutChartOptions(workData, 'work', '직업')} />
                    </div>
                ) : (
                    <div style={{
                        height: '260px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        color: '#999'
                    }}>
                        데이터 없음
                    </div>
                )}
            </div>
        </div>
    );
}