import { useState } from 'react';
import ChoiceItem from "./ChioceItem.tsx";

interface QuestionCardProps {
    question: {
        number: number;
        content: string;
        choiceStatistics: {
            number: number;
            content: string;
            count: number;
        }[] | null;
    };
    surveyId: number;
}

export default function QuestionCard({ question, surveyId }: QuestionCardProps) {
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

    const totalCount = question.choiceStatistics?.reduce((sum, choice) => sum + choice.count, 0) || 0;

    const handleChoiceClick = (choiceNum: number) => {
        if (selectedChoice === choiceNum) {
            setSelectedChoice(null);
        } else {
            setSelectedChoice(choiceNum);
        }
    };

    return (
        <div
            id={`question-${question.number}`}
            style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '20px'
            }}
        >
            <h2 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#342512'
            }}>
                Q{question.number}. {question.content}
            </h2>

            <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                총 응답: {totalCount}명
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {question.choiceStatistics?.map((choice) => (
                    <ChoiceItem
                        key={choice.number}
                        choice={choice}
                        totalCount={totalCount}
                        questionNum={question.number}
                        surveyId={surveyId}
                        isSelected={selectedChoice === choice.number}
                        onSelect={handleChoiceClick}
                    />
                ))}
            </div>
        </div>
    );
}