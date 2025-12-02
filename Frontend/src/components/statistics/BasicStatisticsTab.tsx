import {useRealtimeStatistics} from '../../hooks/useRealtimeStatistics';
import GenderDistributionChart from './GenderDistributionCharts';
import AgeDistributionChart from './AgeDistributionCharts';
import WorkDistributionChart from "./WorkDistributionCharts";

interface BasicStatisticsTabProps {surveyId: number;}

export default function BasicStatisticsTab({surveyId}: BasicStatisticsTabProps) {
    const {data, loading} = useRealtimeStatistics(surveyId);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!data) {
        return null;
    }

    const hasNoParticipants = data.responseCnt === 0;

    if (hasNoParticipants) {
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '40px 0',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <img
                    src="/images/no_survey.jpg"
                    alt="설문에 참여한 사람이 없습니다"
                    style={{
                        maxWidth: '260px',
                        width: '60%',
                        marginBottom: '16px',
                        objectFit: 'contain',
                    }}
                />
                <p style={{
                    fontSize: '16px',
                    color: '#666',
                    textAlign: 'center',
                }}>
                    설문에 참여한 사람이 없습니다.
                </p>
            </div>
        );
    }

    const progressRate = data && data.maxResponse
        ? Math.round((data.responseCnt / data.maxResponse) * 100)
        : 0;

    return (
        <div>
            {/* 설문 현황 */}
            <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e8e8e8',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 20px)',
                marginBottom: '24px',
            }}>
                <h2 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '16px',
                    color: '#342512',
                }}>
                    참여 현황
                </h2>

                {/* 참여 인원 */}
                <div style={{
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <span style={{fontSize: '14px', color: '#666'}}>참여 인원</span>
                    <span style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginLeft: '10px',
                        color: '#B89369',
                    }}>
        {data.responseCnt.toLocaleString()}
    </span>
                    <span style={{fontSize: '16px', color: '#666'}}>
        /{data.maxResponse.toLocaleString()} 명
    </span>
                    <span style={{
                        fontSize: '14px',
                        color: '#666',
                        marginLeft: '10px',
                    }}>
        (현재 응답률 {progressRate}%)
    </span>
                </div>

                {/* 진행률 바 */}
                <div style={{
                    width: '100%',
                    height: '20px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        width: `${progressRate}%`,
                        height: '100%',
                        backgroundColor: '#B89369',
                        transition: 'width 0.3s ease',
                    }}/>
                </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '3fr 7fr', gap: '24px'}}>
                <GenderDistributionChart genderDistribution={data.genderDistribution || []}/>
                <AgeDistributionChart ageDistribution={data.ageDistribution || []}/>
                <div style={{gridColumn: '1 / -1'}}>
                    <WorkDistributionChart workDistribution={data.workDistribution || []}/>
                </div>
            </div>
        </div>
    );
}
