import { useState, useEffect } from "react";
import type { SurveyCreateInfoProps, Interest } from "../../types/SurveyData";
import { getInterests } from "../../api/SurveyApi";
import { FaRegClipboard } from "react-icons/fa";

function SurveyCreateInfo({
                              title,
                              setTitle,
                              description,
                              setDescription,
                              maxResponse,
                              setMaxResponse,
                              reward,
                              setReward,
                              deadline,
                              setDeadline,
                              interestId,
                              setInterestId,
                          }: SurveyCreateInfoProps) {
    const [interests, setInterests] = useState<Interest[]>([]);
    const [isLoadingInterests, setIsLoadingInterests] = useState(true);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await getInterests();
                setInterests(response.data);

                if (response.data.length > 0 && !interestId) {
                    setInterestId(response.data[0].interestId);
                }
            } catch (error) {
                console.error("관심사 목록 조회 실패:", error);
            } finally {
                setIsLoadingInterests(false);
            }
        };

        fetchInterests();
    }, [interestId, setInterestId]);

    return (
        <section
            style={{
                marginBottom: "40px",
                padding: "28px",
                backgroundColor: "#fff",
                border: "1px solid rgba(184, 147, 105, 0.2)",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
        >
            <h2
                style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    marginBottom: "24px",
                    color: "#B89369",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                }}
            >
                <FaRegClipboard style={{ fontSize: "20px" }} />
                기본 정보
            </h2>

            <div style={{ marginBottom: "20px" }}>
                <label
                    style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        color: "#666",
                    }}
                >
                    설문 제목 <span style={{ color: "#B89369" }}>*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="설문 제목을 입력하세요"
                    style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid rgba(184, 147, 105, 0.3)",
                        borderRadius: "8px",
                        fontSize: "14px",
                        transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#B89369";
                        e.currentTarget.style.outline = "none";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(184, 147, 105, 0.3)";
                    }}
                />
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label
                    style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        color: "#666",
                    }}
                >
                    설문 설명 <span style={{ color: "#B89369" }}>*</span>
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="설문에 대한 간단한 설명을 입력하세요"
                    rows={4}
                    style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid rgba(184, 147, 105, 0.3)",
                        borderRadius: "8px",
                        fontSize: "14px",
                        resize: "vertical",
                        transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#B89369";
                        e.currentTarget.style.outline = "none";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(184, 147, 105, 0.3)";
                    }}
                />
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "20px",
                }}
            >
                <div>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: 500,
                            color: "#666",
                        }}
                    >
                        최대 응답자 수 <span style={{ color: "#B89369" }}>*</span>
                    </label>
                    <input
                        type="number"
                        value={maxResponse}
                        onChange={(e) => setMaxResponse(Number(e.target.value))}
                        min={1}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid rgba(184, 147, 105, 0.3)",
                            borderRadius: "8px",
                            fontSize: "14px",
                            transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = "#B89369";
                            e.currentTarget.style.outline = "none";
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = "rgba(184, 147, 105, 0.3)";
                        }}
                    />
                </div>

                <div>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: 500,
                            color: "#666",
                        }}
                    >
                        1인당 리워드 (포인트) <span style={{ color: "#B89369" }}>*</span>
                    </label>
                    <input
                        type="number"
                        value={reward}
                        onChange={(e) => setReward(Number(e.target.value))}
                        min={0}
                        step={100}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid rgba(184, 147, 105, 0.3)",
                            borderRadius: "8px",
                            fontSize: "14px",
                            transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = "#B89369";
                            e.currentTarget.style.outline = "none";
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = "rgba(184, 147, 105, 0.3)";
                        }}
                    />
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                }}
            >
                <div>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: 500,
                            color: "#666",
                        }}
                    >
                        마감일 <span style={{ color: "#B89369" }}>*</span>
                    </label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        min={(() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            return tomorrow.toISOString().split("T")[0];
                        })()}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid rgba(184, 147, 105, 0.3)",
                            borderRadius: "8px",
                            fontSize: "14px",
                            transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = "#B89369";
                            e.currentTarget.style.outline = "none";
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = "rgba(184, 147, 105, 0.3)";
                        }}
                    />
                </div>

                <div>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: 500,
                            color: "#666",
                        }}
                    >
                        관심사 카테고리 <span style={{ color: "#B89369" }}>*</span>
                    </label>
                    <select
                        value={interestId}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const selectedInterest = interests.find(
                                (interest) => interest.interestId === selectedId
                            );

                            console.log("🔍 관심사 카테고리 선택:", {
                                interestId: selectedId,
                                content: selectedInterest?.content,
                                전체정보: selectedInterest,
                            });

                            setInterestId(selectedId);
                        }}
                        disabled={isLoadingInterests}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid rgba(184, 147, 105, 0.3)",
                            borderRadius: "8px",
                            fontSize: "14px",
                            transition: "all 0.2s",
                            backgroundColor: isLoadingInterests ? "#f5f5f5" : "#fff",
                            cursor: isLoadingInterests ? "not-allowed" : "pointer",
                        }}
                        onFocus={(e) => {
                            if (!isLoadingInterests) {
                                e.currentTarget.style.borderColor = "#B89369";
                                e.currentTarget.style.outline = "none";
                            }
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = "rgba(184, 147, 105, 0.3)";
                        }}
                    >
                        {isLoadingInterests ? (
                            <option>로딩 중...</option>
                        ) : interests.length === 0 ? (
                            <option>카테고리 없음</option>
                        ) : (
                            interests.map((interest) => (
                                <option key={interest.interestId} value={interest.interestId}>
                                    {interest.content}
                                </option>
                            ))
                        )}
                    </select>
                </div>
            </div>
        </section>
    );
}

export default SurveyCreateInfo;
