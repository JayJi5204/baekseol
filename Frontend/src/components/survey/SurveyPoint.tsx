import type { SurveyPointProps } from "../../types/SurveyData";
import { calculateTotalPointWithDetails } from "../../utils/calculateTotalPointWithDetails";
import { useEffect } from "react";
import { FaCoins, FaExclamationTriangle } from "react-icons/fa";

function SurveyPoint({
                         userPoint,
                         reward,
                         maxResponse,
                         questionCnt,
                         isLoadingPoint,
                         onPointSufficiencyChange,
                     }: SurveyPointProps & {
    onPointSufficiencyChange: (sufficient: boolean) => void;
}) {
    const { total, fee } = calculateTotalPointWithDetails(
        questionCnt,
        maxResponse,
        reward
    );

    const remainingPoint = userPoint - total;
    const isPointSufficient = remainingPoint >= 0;

    useEffect(() => {
        onPointSufficiencyChange(isPointSufficient);
    }, [isPointSufficient, onPointSufficiencyChange]);

    if (isLoadingPoint) {
        return (
            <div
                style={{
                    padding: "16px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    textAlign: "center",
                    color: "#B89369",
                    border: "1px solid rgba(184, 147, 105, 0.2)",
                }}
            >
                <div
                    style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        border: "2px solid #F3F1E5",
                        borderTop: "2px solid #B89369",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        marginRight: "8px",
                    }}
                />
                포인트 정보 로딩 중...
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

    return (
        <div
            style={{
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                marginBottom: "20px",
                border: `2px solid ${
                    isPointSufficient
                        ? "rgba(184, 147, 105, 0.3)"
                        : "rgba(220, 53, 69, 0.4)"
                }`,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
        >
            <h3
                style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginBottom: "16px",
                    color: "#B89369",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                }}
            >
                <FaCoins style={{ fontSize: "18px" }} />
                포인트 사용 내역
            </h3>
            <div style={{ fontSize: "14px", color: "#333", lineHeight: 1.8 }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                    }}
                >
                    <span style={{ color: "#666" }}>보유 포인트:</span>
                    <strong style={{ color: "#B89369" }}>
                        {userPoint.toLocaleString()}P
                    </strong>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                    }}
                >
                    <span style={{ color: "#666" }}>1인당 리워드:</span>
                    <span>{reward.toLocaleString()}P</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                    }}
                >
                    <span style={{ color: "#666" }}>최대 응답자:</span>
                    <span>{maxResponse}명</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                    }}
                >
                    <span style={{ color: "#666" }}>질문 수:</span>
                    <span>{questionCnt}개</span>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                    }}
                >
                    <span style={{ color: "#666" }}>수수료:</span>
                    <span>{fee.toLocaleString()}P</span>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingTop: "12px",
                        borderTop: "2px solid rgba(184, 147, 105, 0.2)",
                        marginTop: "12px",
                    }}
                >
          <span style={{ fontWeight: 600, color: "#B89369" }}>
            총 필요 포인트:
          </span>
                    <strong style={{ color: "#B89369", fontSize: "16px" }}>
                        {total.toLocaleString()}P
                    </strong>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "8px",
                    }}
                >
          <span style={{ fontWeight: 600, color: "#B89369" }}>
            등록 후 잔액:
          </span>
                    <strong
                        style={{
                            color: isPointSufficient ? "#28a745" : "#dc3545",
                            fontSize: "16px",
                        }}
                    >
                        {remainingPoint.toLocaleString()}P
                    </strong>
                </div>
            </div>
            {!isPointSufficient && (
                <div
                    style={{
                        marginTop: "16px",
                        padding: "12px 16px",
                        backgroundColor: "rgba(220, 53, 69, 0.05)",
                        borderRadius: "6px",
                        border: "1px solid rgba(220, 53, 69, 0.3)",
                        color: "#721c24",
                        fontSize: "13px",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <FaExclamationTriangle style={{ fontSize: "16px" }} />
                    <span>
            포인트가{" "}
                        <strong>{Math.abs(remainingPoint).toLocaleString()}P</strong>{" "}
                        부족합니다!
          </span>
                </div>
            )}
        </div>
    );
}

export default SurveyPoint;
