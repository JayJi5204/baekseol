import { useState, useEffect } from 'react';
import { getAnswers } from '../../api/SurveyStatisticsApi';
import type { ObjectiveStatisticsResponse } from '../../types/Statistics';
import QuestionCard from './QuestionCard';

interface ObjectiveStatisticsTabProps {
    surveyId: number;
}

export default function ObjectiveStatisticsTab({ surveyId }: ObjectiveStatisticsTabProps) {
    const [data, setData] = useState<ObjectiveStatisticsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAnswers(surveyId)
            .then(response => {
                console.log('객관식 통계 로드:', response);
                setData(response);
            })
            .catch(err => console.error('객관식 통계 로드 실패:', err))
            .finally(() => setLoading(false));
    }, [surveyId]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!data) {
        return null;
    }

    return (
        <div>
            {data.questionStatistics
                .filter(q => q.choiceStatistics !== null)
                .map((question) => (
                    <QuestionCard
                        key={question.number}
                        question={question}
                        surveyId={surveyId}
                    />
                ))}
        </div>
    );
}