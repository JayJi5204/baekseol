// src/pages/survey/components/SubjectiveStatisticsTab.tsx
import { useState, useEffect } from 'react';
import { getAnswers, getSubjectiveAnswers } from '../../api/SurveyStatisticsApi';
import type { ObjectiveStatisticsResponse, PageableResponse } from '../../types/Statistics';

interface SubjectiveStatisticsTabProps {
    surveyId: number;
}

export default function SubjectiveStatisticsTab({ surveyId }: SubjectiveStatisticsTabProps) {
    const [data, setData] = useState<ObjectiveStatisticsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // 필터 & 응답
    const [filters, setFilters] = useState({
        workType: '',
        gender: '',
        ageGroup: ''
    });
    const [answers, setAnswers] = useState<Record<number, PageableResponse<string>>>({});
    const [answerLoading, setAnswerLoading] = useState<Record<number, boolean>>({});
    const [currentPage, setCurrentPage] = useState<Record<number, number>>({});

    useEffect(() => {
        setLoading(true);
        getAnswers(surveyId)
            .then(response => {
                console.log('주관식 질문 로드:', response);
                setData(response);
            })
            .catch(err => console.error('주관식 질문 로드 실패:', err))
            .finally(() => setLoading(false));
    }, [surveyId]);

    const fetchAnswers = (questionNumber: number, page: number = 0) => {
        setAnswerLoading(prev => ({ ...prev, [questionNumber]: true }));

        getSubjectiveAnswers(surveyId, questionNumber, {
            ...filters,
            page,
            size: 10
        })
            .then(response => {
                console.log('주관식 응답 로드:', response);
                setAnswers(prev => ({ ...prev, [questionNumber]: response }));
                setCurrentPage(prev => ({ ...prev, [questionNumber]: page }));
            })
            .catch(err => console.error('주관식 응답 로드 실패:', err))
            .finally(() => {
                setAnswerLoading(prev => ({ ...prev, [questionNumber]: false }));
            });
    };

    const handleFilterChange = (filterType: 'workType' | 'gender' | 'ageGroup', value: string) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const handleApplyFilters = (questionNumber: number) => {
        fetchAnswers(questionNumber, 0);
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!data) {
        return null;
    }

    return (
        <div>
            {data.questionStatistics
                .filter(q => q.subjectStatistics !== null)
                .map((question) => {
                    const questionAnswers = answers[question.number];
                    const isLoading = answerLoading[question.number];
                    const page = currentPage[question.number] || 0;

                    return (
                        <div key={question.number}
                             id={`question-${question.number}`}
                             style={{
                                backgroundColor: 'white',
                                padding: '30px',
                                borderRadius: '8px',
                                marginBottom: '20px'
                            }}>
                            {/* 질문 */}
                            <h2 style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                marginBottom: '20px',
                                color: '#342512'
                            }}>
                                Q{question.number}. {question.content}
                            </h2>

                            {/* 필터 섹션 */}
                            <div style={{
                                display: 'flex',
                                gap: '15px',
                                marginBottom: '20px',
                                alignItems: 'flex-end'
                            }}>
                                {/* 직업 필터 */}
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '13px', color: '#666', marginBottom: '5px', display: 'block' }}>
                                        직업
                                    </label>
                                    <select
                                        value={filters.workType}
                                        onChange={(e) => handleFilterChange('workType', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #ddd',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="IT">IT</option>
                                        <option value="OFFICE">사무직</option>
                                        <option value="MANUFACTURING">제조업</option>
                                        <option value="SERVICE">서비스업</option>
                                        <option value="EDUCATION">교육</option>
                                        <option value="MEDICAL">의료</option>
                                        <option value="CREATIVE">창작</option>
                                        <option value="STUDENT">학생</option>
                                        <option value="SELF_EMPLOYED">자영업</option>
                                        <option value="ETC">기타</option>
                                    </select>
                                </div>

                                {/* 성별 필터 */}
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '13px', color: '#666', marginBottom: '5px', display: 'block' }}>
                                        성별
                                    </label>
                                    <select
                                        value={filters.gender}
                                        onChange={(e) => handleFilterChange('gender', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #ddd',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="MALE">남성</option>
                                        <option value="FEMALE">여성</option>
                                    </select>
                                </div>

                                {/* 연령 필터 */}
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '13px', color: '#666', marginBottom: '5px', display: 'block' }}>
                                        연령대
                                    </label>
                                    <select
                                        value={filters.ageGroup}
                                        onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #ddd',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="TEEN">10대</option>
                                        <option value="TWENTIES">20대</option>
                                        <option value="THIRTIES">30대</option>
                                        <option value="FORTIES">40대</option>
                                        <option value="FIFTIES">50대</option>
                                        <option value="SIXTY_PLUS">60대 이상</option>
                                    </select>
                                </div>

                                {/* 조회 버튼 */}
                                <button
                                    onClick={() => handleApplyFilters(question.number)}
                                    style={{
                                        backgroundColor: '#B89369',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 20px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    조회
                                </button>
                            </div>

                            {/* 응답 목록 */}
                            {isLoading ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    로딩 중...
                                </div>
                            ) : questionAnswers ? (
                                <div>
                                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                                        총 {questionAnswers.totalElements}개의 응답
                                    </div>

                                    {/* 응답 카드 목록 */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {questionAnswers.content.map((answer, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    padding: '15px',
                                                    backgroundColor: '#f9f9f9',
                                                    borderRadius: '4px',
                                                    borderLeft: '3px solid #B89369'
                                                }}
                                            >
                                                <div style={{ fontSize: '15px', color: '#342512', lineHeight: '1.6' }}>
                                                    {answer}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 페이지네이션 */}
                                    {questionAnswers.totalPages > 1 && (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '5px',
                                            marginTop: '20px'
                                        }}>
                                            <button
                                                onClick={() => fetchAnswers(question.number, page - 1)}
                                                disabled={questionAnswers.first}
                                                style={{
                                                    padding: '8px 12px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    backgroundColor: questionAnswers.first ? '#f0f0f0' : 'white',
                                                    cursor: questionAnswers.first ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                이전
                                            </button>

                                            <span style={{ padding: '8px 12px', color: '#666' }}>
                                                {page + 1} / {questionAnswers.totalPages}
                                            </span>

                                            <button
                                                onClick={() => fetchAnswers(question.number, page + 1)}
                                                disabled={questionAnswers.last}
                                                style={{
                                                    padding: '8px 12px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    backgroundColor: questionAnswers.last ? '#f0f0f0' : 'white',
                                                    cursor: questionAnswers.last ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                다음
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                    필터를 선택하고 조회 버튼을 눌러주세요
                                </div>
                            )}
                        </div>
                    );
                })}
        </div>
    );
}
