import type {Question} from '../../types/Statistics';

interface StatisticsSidebarProps {
    activeTab: 'basic' | 'objective' | 'subjective';
    setActiveTab: (tab: 'basic' | 'objective' | 'subjective') => void;
    objectiveQuestions: Question[];
    subjectiveQuestions: Question[];
    loading: boolean;
    visibleQuestionNumber: number | null;
    onQuestionClick: (questionNumber: number) => void;
}

export default function StatisticsSidebar({
                                              activeTab,
                                              setActiveTab,
                                              objectiveQuestions,
                                              subjectiveQuestions,
                                              loading,
                                              visibleQuestionNumber,
                                              onQuestionClick
                                          }: StatisticsSidebarProps) {
    return (
        <aside style={{
            width: '240px',
            backgroundColor: '#3E445A',
            padding: '24px 0',
            position: 'sticky',
            top: '0',
            height: '100vh',
            overflowY: 'auto'
        }}>
            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
            <nav>
                {/* 질의지 통계 */}
                <div>
                    <button
                        onClick={() => setActiveTab('basic')}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            color: activeTab === 'basic' ? '#B89369' : '#B0B5C3',
                            textAlign: 'left',
                            borderLeft: activeTab === 'basic' ? '3px solid #B89369' : '3px solid transparent',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        실시간 참여 현황
                    </button>
                </div>

                {/* 객관식 통계 */}
                <div>
                    <button
                        onClick={() => setActiveTab('objective')}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            color: activeTab === 'objective' ? '#B89369' : '#B0B5C3',
                            textAlign: 'left',
                            borderLeft: activeTab === 'objective' ? '3px solid #B89369' : '3px solid transparent',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        객관식 통계
                    </button>
                    {activeTab === 'objective' && !loading && objectiveQuestions.length > 0 && (
                        <div style={{
                            paddingLeft: '20px',
                            marginTop: '4px',
                            animation: 'slideDown 0.3s ease-out'
                        }}>
                            {objectiveQuestions.map((q, index) => (
                                <div
                                    key={q.number}
                                    onClick={() => onQuestionClick(q.number)}
                                    style={{
                                        padding: '8px 20px',
                                        fontSize: '13px',
                                        color: visibleQuestionNumber === q.number ? '#F3F1E5' : '#B0B5C3',
                                        fontWeight: visibleQuestionNumber === q.number ? '600' : '400',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                                    }}
                                    onMouseEnter={(e) => {
                                        if (visibleQuestionNumber !== q.number) {
                                            e.currentTarget.style.color = '#F3F1E5';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (visibleQuestionNumber !== q.number) {
                                            e.currentTarget.style.color = '#B0B5C3';
                                        }
                                    }}
                                >
                                    Q{q.number}. {q.content}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 주관식 통계 */}
                <div>
                    <button
                        onClick={() => setActiveTab('subjective')}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            color: activeTab === 'subjective' ? '#B89369' : '#B0B5C3',
                            textAlign: 'left',
                            borderLeft: activeTab === 'subjective' ? '3px solid #B89369' : '3px solid transparent',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        주관식 통계
                    </button>
                    {activeTab === 'subjective' && !loading && subjectiveQuestions.length > 0 && (
                        <div style={{
                            paddingLeft: '20px',
                            marginTop: '4px',
                            animation: 'slideDown 0.3s ease-out'
                        }}>
                            {subjectiveQuestions.map((q, index) => (
                                <div
                                    key={q.number}
                                    onClick={() => onQuestionClick(q.number)}
                                    style={{
                                        padding: '8px 20px',
                                        fontSize: '13px',
                                        color: visibleQuestionNumber === q.number ? '#F3F1E5' : '#B0B5C3',
                                        fontWeight: visibleQuestionNumber === q.number ? '600' : '400',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                                    }}
                                    onMouseEnter={(e) => {
                                        if (visibleQuestionNumber !== q.number) {
                                            e.currentTarget.style.color = '#F3F1E5';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (visibleQuestionNumber !== q.number) {
                                            e.currentTarget.style.color = '#B0B5C3';
                                        }
                                    }}
                                >
                                    Q{q.number}. {q.content}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
}