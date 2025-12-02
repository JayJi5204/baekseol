import { useState, useEffect } from 'react';
import { getChoiceParticipants } from '../../api/SurveyStatisticsApi';
import type { ParticipantStatistics } from '../../types/Statistics';
import ChoiceDistribution from './ChoiceDistribution';

interface ChoiceItemProps {
    choice: {
        number: number;
        content: string;
        count: number;
    };
    totalCount: number;
    questionNum: number;
    surveyId: number;
    isSelected: boolean;
    onSelect: (choiceNum: number) => void;
}

export default function ChoiceItem({ choice, totalCount, questionNum, surveyId, isSelected, onSelect }: ChoiceItemProps) {
    const [distribution, setDistribution] = useState<ParticipantStatistics | null>(null);
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isSelected && !distribution) {
            setLoading(true);
            getChoiceParticipants(surveyId, questionNum, choice.number)
                .then(response => {
                    console.log('선택지별 참여자 분포:', response);
                    setDistribution(response);
                })
                .catch(err => console.error('선택지별 분포 로드 실패:', err))
                .finally(() => setLoading(false));
        }
    }, [isSelected, surveyId, questionNum, choice.number, distribution]);

    const percentage = totalCount > 0 ? Math.round((choice.count / totalCount) * 100) : 0;

    return (
        <div>
            <div
                onClick={() => onSelect(choice.number)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    cursor: 'pointer',
                    padding: '16px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #B89369' : '1px solid #e8e8e8',
                    backgroundColor: isSelected ? '#FFF9F5' : 'white',
                    transition: 'all 0.2s ease',
                    boxShadow: isHovered
                        ? '0 2px 8px rgba(184, 147, 105, 0.15)'
                        : '0 1px 2px rgba(0, 0, 0, 0.04)',
                    transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                        <span style={{
                            fontSize: '13px',
                            fontWeight: '700',
                            color: isSelected ? '#B89369' : '#666',
                            minWidth: '20px',
                            transition: 'color 0.2s'
                        }}>
                            {choice.number}
                        </span>
                        <span style={{
                            fontSize: '14px',
                            color: '#342512',
                            lineHeight: '1.5'
                        }}>
                            {choice.content}
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginLeft: '16px'
                    }}>
                        <span style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#342512'
                        }}>
                            {choice.count}명
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: '#999'
                        }}>
                            ({percentage}%)
                        </span>
                    </div>
                </div>

                <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '3px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: isSelected ? '#B89369' : '#d4c4b0',
                        transition: 'all 0.3s ease'
                    }} />
                </div>
            </div>

            <div style={{
                maxHeight: isSelected ? '1000px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s ease-out, opacity 0.4s ease-out, margin-top 0.4s ease-out',
                opacity: isSelected ? 1 : 0,
                marginTop: isSelected ? '12px' : '0',
            }}>
                <div style={{
                    padding: '20px',
                    backgroundColor: '#FAFAFA',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0',
                }}>
                    {loading ? (
                        <div style={{ fontSize: '14px', color: '#666' }}>로딩 중...</div>
                    ) : distribution ? (
                        <ChoiceDistribution distribution={distribution} />
                    ) : null}
                </div>
            </div>
        </div>
    );
}