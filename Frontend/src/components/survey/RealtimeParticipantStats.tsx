// src/components/survey/RealtimeParticipantStats.tsx
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { ParticipantStatistics } from "../../types/SurveyData";

interface Props {
    surveyId: number;
    maxResponseFallback?: number;
    initialStats?: ParticipantStatistics | null;
}

export default function RealtimeParticipantStats({
                                                     surveyId,
                                                     maxResponseFallback,
                                                     initialStats = null,
                                                 }: Props) {
    const [stats, setStats] = useState<ParticipantStatistics | null>(initialStats);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(initialStats ? false : true);


    useEffect(() => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

        // /api/v1 제거하고 /ws 붙이기
        // http://localhost:8081/api/v1 → http://localhost:8081/ws
        const baseUrlWithoutApi = API_BASE_URL.replace("/api/v1", "");
        const socketUrl = `${baseUrlWithoutApi}/ws`;

        const socket = new SockJS(socketUrl);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                setConnected(true);
                stompClient.subscribe(`/topic/survey/${surveyId}/statistics`, (msg) => {
                    const newData = JSON.parse(msg.body);
                    setStats(newData);
                    setLoading(false);
                });
            },
            onDisconnect: () => setConnected(false),
            onStompError: () => setConnected(false),
        });

        stompClient.activate();

        return () => {
            if (stompClient.active) stompClient.deactivate();
        };
    }, [surveyId]);


    const remainingCount =
        stats && stats.maxResponse != null && stats.responseCnt != null
            ? stats.maxResponse - stats.responseCnt
            : null;
    const isWarning = remainingCount !== null && remainingCount <= 5;

    return (
        <div
            style={{
                position: "fixed",
                top: 100,
                right: 20,
                backgroundColor: isWarning ? "#ffe6e6" : "#F3F1E5",
                border: `1px solid ${isWarning ? "#ff4d4d" : "#B89369"}`,
                borderRadius: 8,
                padding: "12px 20px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                zIndex: 1000,
                minWidth: 180,
                fontFamily: "Arial, sans-serif",
                transition: "background-color 0.3s, border-color 0.3s",
            }}
        >
            <div className="flex items-center gap-2 text-xs mb-1">
        <span
            className={`w-2 h-2 rounded-full transition-colors ${
                connected ? "bg-green-500" : "bg-gray-300"
            }`}
            title={connected ? "실시간 연결됨" : "연결 중..."}
        />
                <span className="font-semibold" style={{ color: isWarning ? "#b30000" : "#555" }}>
          {connected ? "실시간 제출 현황" : "연결 중"}
        </span>
            </div>
            <div
                className="text-2xl font-bold text-center"
                style={{ color: isWarning ? "#b30000" : "#B89369" }}
            >
                {loading || !stats ? <span className="text-gray-400">-</span> : stats.responseCnt}
            </div>
            <div
                className="text-xs text-center mt-1"
                style={{ color: isWarning ? "#b30000" : "#666" }}
            >
                / {stats?.maxResponse ?? maxResponseFallback ?? "-"}
            </div>
            {isWarning && (
                <div className="mt-2 text-sm font-semibold text-center" style={{ color: "#b30000" }}>
                    ⚠️ {remainingCount}명 남았습니다! 서둘러 참여하세요!
                </div>
            )}
        </div>
    );
}
