import type { Question } from "../../types/SurveyData";

interface SurveyDetailQuestionsProps {
  questions: Question[];
}

function SurveyDetailQuestions({ questions }: SurveyDetailQuestionsProps) {
  return (
    <section
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        padding: "32px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "24px",
        }}
      >
        질문 목록 ({questions.length}개)
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {questions.map((question) => (
          <div
            key={question.number}
            style={{
              padding: "24px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            {/* 질문 헤더 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: "14px",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {question.number}
              </span>
              <span
                style={{
                  padding: "4px 12px",
                  backgroundColor:
                    question.type === "MULTIPLE_CHOICE" ? "#e7f5ff" : "#fff3cd",
                  color:
                    question.type === "MULTIPLE_CHOICE" ? "#0066cc" : "#856404",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {question.type === "MULTIPLE_CHOICE" ? "객관식" : "주관식"}
              </span>
            </div>

            {/* 질문 내용 */}
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "16px",
                color: "#333",
              }}
            >
              {question.content}
            </h3>

            {/* 선택지 (객관식일 때만) */}
            {question.type === "MULTIPLE_CHOICE" &&
              question.choices.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginTop: "16px",
                  }}
                >
                  {question.choices.map((choice) => (
                    <div
                      key={choice.number}
                      style={{
                        padding: "12px 16px",
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "24px",
                          height: "24px",
                          border: "2px solid #ddd",
                          borderRadius: "50%",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#666",
                          flexShrink: 0,
                        }}
                      >
                        {choice.number}
                      </span>
                      <span style={{ fontSize: "15px", color: "#333" }}>
                        {choice.content}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            {/* 주관식 안내 */}
            {question.type === "SUBJECTIVE" && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#fff",
                  border: "1px dashed #ddd",
                  borderRadius: "6px",
                  color: "#666",
                  fontSize: "14px",
                  fontStyle: "italic",
                  marginTop: "16px",
                }}
              >
                참여자가 자유롭게 답변을 작성할 수 있는 질문입니다.
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default SurveyDetailQuestions;
