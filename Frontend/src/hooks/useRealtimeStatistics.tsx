// src/hooks/useRealtimeStatistics.tsx
import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type {ParticipantStatistics} from '../types/Statistics';
import { getParticipantStatistics } from '../api/SurveyStatisticsApi';  // ← 이거 추가!

export const useRealtimeStatistics = (surveyId: number) => {
    const [data, setData] = useState<ParticipantStatistics | null>(null);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        // 먼저 REST API로 초기 데이터 가져오기
        const fetchInitialData = async () => {
            try {
                console.log('초기 데이터 요청:', surveyId);
                const initialData = await getParticipantStatistics(surveyId);
                console.log('초기 데이터 수신:', initialData);
                setData(initialData);
            } catch (err) {
                console.error('초기 데이터 로드 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();

        const baseUrlWithoutApi = API_BASE_URL.replace("/api/v1", "");
        const socketUrl = `${baseUrlWithoutApi}/ws`;

        // WebSocket 연결 (실시간 업데이트용)
        const socket = new SockJS(socketUrl);
        const stompClient = new Client({
            webSocketFactory: () => socket,

            onConnect: () => {
                console.log('WebSocket 연결 성공');
                setConnected(true);

                stompClient.subscribe(
                    `/topic/survey/${surveyId}/statistics`,
                    (message) => {
                        const newData = JSON.parse(message.body);
                        console.log('실시간 통계 수신:', newData);
                        setData(newData);
                    }
                );

            },
        });

        stompClient.activate();

        return () => {
            if (stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, [surveyId]);

    return { data, connected, loading };
};
