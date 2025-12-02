import {useState} from 'react';
import type {SurveyDetailResDto} from '../../types/SurveyData';

interface SurveyHeaderProps {
    surveyInfo: SurveyDetailResDto | null;
    onSettlementClick: () => void;
}

export default function SurveyHeader({surveyInfo, onSettlementClick}: SurveyHeaderProps) {
    const [showDescription, setShowDescription] = useState(false);

    // 상태 텍스트 변환
    const getStateText = (state: string) => {
        switch (state) {
            case 'IN_PROCESS':
                return '진행중';
            case 'DONE':
                return '종료됨';
            default:
                return state;
        }
    };

    // 상태별 배경색
    const getStateBgColor = (state: string) => {
        switch (state) {
            case 'IN_PROCESS':
                return '#B89369';
            case 'DONE':
                return '#999';
            default:
                return '#B89369';
        }
    };

    // 날짜 포맷팅
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // D-day 계산
    const calculateDaysLeft = () => {
        if (!surveyInfo?.deadline) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const end = new Date(surveyInfo.deadline);
        end.setHours(0, 0, 0, 0);

        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    const daysLeft = calculateDaysLeft();

    // D-day 텍스트
    const getDdayText = () => {
        if (daysLeft === null) return null;
        if (daysLeft < 0) return '마감 완료';
        if (daysLeft === 0) return 'D-Day';
        return `D-${daysLeft}`;
    };

    const dDayText = getDdayText();

    return (
        <div style={{
            paddingBottom: '20px',
            marginBottom: '24px'
        }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{flex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px'}}>
                        <h1 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#342512',
                            letterSpacing: '-0.3px',
                            margin: 0,
                            lineHeight: 1
                        }}>
                            {surveyInfo?.title || '설문 제목 로딩 중...'}
                        </h1>
                        {dDayText && (
                            <span style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                padding: '4px 12px',
                                borderRadius: '6px',
                                border: dDayText === '마감 완료' ? '1.5px solid #999' : '1.5px solid #3E445A',
                                backgroundColor: 'transparent',
                                color: dDayText === '마감 완료' ? '#999' : '#3E445A',
                                lineHeight: 1
                            }}>
                            {dDayText}
                        </span>
                        )}
                    </div>
                    <div style={{
                        fontSize: '13px',
                        color: '#666',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center'
                    }}>
                        {surveyInfo && (
                            <>
                            <span style={{
                                backgroundColor: getStateBgColor(surveyInfo.state),
                                color: 'white',
                                padding: '3px 8px',
                                borderRadius: '3px',
                                fontSize: '12px',
                                lineHeight: 1
                            }}>
                                {getStateText(surveyInfo.state)}
                            </span>
                                <span>종료일: {formatDate(surveyInfo.deadline)}</span>
                                <span>리워드: {surveyInfo.reward}원</span>
                            </>
                        )}
                    </div>
                </div>
                <button
                    onClick={onSettlementClick}
                    style={{
                        backgroundColor: '#B89369',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        flexShrink: 0
                    }}
                >
                    정산하기
                </button>
            </div>

            {/* Description 영역 */}
            {surveyInfo?.description && (
                <div style={{
                    maxHeight: showDescription ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease-out, opacity 0.4s ease-out, margin-top 0.4s ease-out',
                    opacity: showDescription ? 1 : 0,
                    marginTop: showDescription ? '20px' : '0',
                }}>
                    <div style={{
                        fontSize: '14px',
                        color: '#666',
                        lineHeight: '1.6',
                        paddingBottom: '10px'
                    }}>
                        {surveyInfo.description}
                    </div>
                </div>
            )}

            {/* 클릭 가능한 구분선 */}
            {surveyInfo?.description && (
                <div
                    onClick={() => setShowDescription(!showDescription)}
                    style={{
                        marginTop: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        position: 'relative'
                    }}
                >
                    <div style={{
                        flex: 1,
                        height: '1px',
                        backgroundColor: '#E5E5E5'
                    }}/>
                    <span style={{
                        padding: '0 12px',
                        fontSize: '10px',
                        color: '#999',
                        transition: 'all 0.2s ease',
                        transform: showDescription ? 'rotate(180deg)' : 'rotate(0deg)',
                        display: 'inline-block'
                    }}>
                    ▼
                </span>
                    <div style={{
                        flex: 1,
                        height: '1px',
                        backgroundColor: '#E5E5E5'
                    }}/>
                </div>
            )}

            {!surveyInfo?.description && (
                <div style={{
                    marginTop: '20px',
                    height: '1px',
                    backgroundColor: '#E5E5E5'
                }}/>
            )}
        </div>
    );
}