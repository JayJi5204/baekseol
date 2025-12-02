// src/components/survey/SurveyList.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SurveyItemResDto } from "../../types/SurveyData";
import { checkParticipation } from "../../api/SurveyApi";
import {
    FaRegUser,
    FaRegMoneyBillAlt,
    FaRegCalendarAlt,
    FaRegClipboard,
} from "react-icons/fa";

interface SurveyListProps {
    surveys: SurveyItemResDto[];
    isLoading: boolean;
    participatedMapFromParent?: Record<number, boolean>;
}

function SurveyList({
                        surveys,
                        isLoading,
                        participatedMapFromParent,
                    }: SurveyListProps) {
    const navigate = useNavigate();
    const [participatedMap, setParticipatedMap] = useState<Record<number, boolean>>(
        {}
    );

    // 부모에서 맵을 내려주면 그대로 사용
    useEffect(() => {
        if (participatedMapFromParent) {
            setParticipatedMap(participatedMapFromParent);
        }
    }, [participatedMapFromParent]);

    // 부모에서 안 내려준 경우에만 자체적으로 참여 여부 조회
    useEffect(() => {
        if (participatedMapFromParent) return;

        const token =
            sessionStorage.getItem("accessToken") ||
            localStorage.getItem("authToken");
        if (!token || surveys.length === 0) return;

        const fetchAll = async () => {
            try {
                const results = await Promise.all(
                    surveys.map((s) =>
                        checkParticipation(s.surveyId)
                            .then((res) => ({ id: s.surveyId, value: res.data as boolean }))
                            .catch(() => ({ id: s.surveyId, value: false }))
                    )
                );
                const map: Record<number, boolean> = {};
                results.forEach(({ id, value }) => {
                    map[id] = value;
                });
                setParticipatedMap(map);
            } catch (e) {
                console.error("목록 참여 여부 조회 실패:", e);
            }
        };

        fetchAll();
    }, [surveys, participatedMapFromParent]);

    const formatDate = (dateString: string) => dateString.split("T")[0];

    // 여기서는 surveyId만 필요
    const handleSurveyClick = (surveyId: number) => {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
            alert("로그인 후 이용해주세요.");
            navigate("/users/login");
            return;
        }
        navigate(`/surveys/${surveyId}`);
    };

    if (isLoading) {
        return (
            <div
                style={{
                    padding: "60px 40px",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "1px solid rgba(184, 147, 105, 0.2)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                }}
            >
                <div
                    style={{
                        width: "48px",
                        height: "48px",
                        border: "3px solid #F3F1E5",
                        borderTop: "3px solid #B89369",
                        borderRadius: "50%",
                        margin: "0 auto 16px",
                        animation: "spin 1s linear infinite",
                    }}
                />
                <p style={{ color: "#B89369", fontSize: "16px", margin: 0 }}>
                    설문 목록을 불러오는 중...
                </p>
                <style>
                    {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
                </style>
            </div>
        );
    }

    if (surveys.length === 0) {
        return (
            <div
                style={{
                    padding: "60px 40px",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "1px solid rgba(184, 147, 105, 0.2)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                }}
            >
                <div
                    style={{
                        width: "64px",
                        height: "64px",
                        backgroundColor: "rgba(184, 147, 105, 0.1)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                        fontSize: "32px",
                        color: "#B89369",
                    }}
                >
                    <FaRegClipboard />
                </div>
                <p style={{ color: "#B89369", fontSize: "16px", margin: 0 }}>
                    조회된 설문이 없습니다.
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {surveys.map((survey) => {
                const hasParticipated = participatedMap[survey.surveyId] ?? false;

                return (
                    <div
                        key={survey.surveyId}
                        onClick={() => handleSurveyClick(survey.surveyId)}
                        style={{
                            padding: "24px",
                            backgroundColor: hasParticipated ? "#F5F7FF" : "#fff",
                            border: hasParticipated
                                ? "1px solid rgba(59, 130, 246, 0.4)"
                                : "1px solid rgba(184, 147, 105, 0.2)",
                            borderRadius: "12px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: hasParticipated
                                ? "0 4px 14px rgba(59, 130, 246, 0.18)"
                                : "0 2px 8px rgba(0, 0, 0, 0.05)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = hasParticipated
                                ? "0 6px 18px rgba(59, 130, 246, 0.25)"
                                : "0 8px 20px rgba(184, 147, 105, 0.15)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = hasParticipated
                                ? "0 4px 14px rgba(59, 130, 246, 0.18)"
                                : "0 2px 8px rgba(0, 0, 0, 0.05)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <h3
                            style={{
                                margin: "0 0 12px 0",
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "#B89369",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            {survey.title}
                            {hasParticipated && (
                                <span
                                    style={{
                                        fontSize: "11px",
                                        padding: "3px 8px",
                                        borderRadius: "999px",
                                        backgroundColor: "rgba(59,130,246,0.08)",
                                        color: "#2563EB",
                                        fontWeight: 600,
                                    }}
                                >
                  참여 완료
                </span>
                            )}
                        </h3>

                        <div
                            style={{
                                display: "flex",
                                gap: "16px",
                                fontSize: "14px",
                                color: "#666",
                                flexWrap: "wrap",
                                alignItems: "center",
                            }}
                        >
                            {/* 참여자 */}
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                <FaRegUser style={{ fontSize: "16px", color: "#B89369" }} />
                참여자: {survey.responseCnt}/{survey.maxResponse}명
              </span>

                            {/* 리워드 */}
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                <FaRegMoneyBillAlt
                    style={{ fontSize: "16px", color: "#B89369" }}
                />
                리워드:
                <strong style={{ color: "#B89369" }}>
                  {survey.reward.toLocaleString()}
                </strong>
                원
              </span>

                            {/* 마감일 */}
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                <FaRegCalendarAlt
                    style={{ fontSize: "16px", color: "#B89369" }}
                />
                마감: {formatDate(survey.deadline)}
              </span>

                            {/* 상태 뱃지 */}
                            <span
                                style={{
                                    padding: "4px 12px",
                                    backgroundColor:
                                        survey.state === "IN_PROCESS"
                                            ? "rgba(34, 197, 94, 0.1)"
                                            : "#F3F1E5",
                                    color:
                                        survey.state === "IN_PROCESS" ? "#16a34a" : "#B89369",
                                    borderRadius: "6px",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                }}
                            >
                {survey.state === "IN_PROCESS" ? "진행중" : "완료"}
              </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default SurveyList;
