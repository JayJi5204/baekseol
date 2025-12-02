import type { Question, QuestionType } from "../../types/SurveyData";
import { FaRegQuestionCircle, FaPlus, FaTrash } from "react-icons/fa";

interface SurveyCreateQuestionProps {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
}

function SurveyCreateQuestion({
                                questions,
                                setQuestions,
                              }: SurveyCreateQuestionProps) {
  const addQuestion = () => {
    const newQuestion: Question = {
      number: questions.length + 1,
      content: "",
      type: "MULTIPLE_CHOICE",
      choices: [
        { number: 1, content: "" },
        { number: 2, content: "" },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    const renumbered = updated.map((q, i) => ({ ...q, number: i + 1 }));
    setQuestions(renumbered);
  };

  const updateQuestionContent = (index: number, content: string) => {
    const updated = [...questions];
    updated[index].content = content;
    setQuestions(updated);
  };

  const updateQuestionType = (index: number, type: QuestionType) => {
    const updated = [...questions];
    updated[index].type = type;
    if (type === "SUBJECTIVE") {
      updated[index].choices = [];
    } else {
      updated[index].choices = [
        { number: 1, content: "" },
        { number: 2, content: "" },
      ];
    }
    setQuestions(updated);
  };

  const addChoice = (questionIndex: number) => {
    const updated = [...questions];
    const choices = updated[questionIndex].choices;
    choices.push({
      number: choices.length + 1,
      content: "",
    });
    setQuestions(updated);
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    const updated = [...questions];
    const choices = updated[questionIndex].choices.filter(
        (_, i) => i !== choiceIndex
    );
    updated[questionIndex].choices = choices.map((c, i) => ({
      ...c,
      number: i + 1,
    }));
    setQuestions(updated);
  };

  const updateChoiceContent = (
      questionIndex: number,
      choiceIndex: number,
      content: string
  ) => {
    const updated = [...questions];
    updated[questionIndex].choices[choiceIndex].content = content;
    setQuestions(updated);
  };

  return (
      <section style={{ marginBottom: "40px" }}>
        <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
        >
          <h2
              style={{
                fontSize: "22px",
                fontWeight: 600,
                margin: 0,
                color: "#B89369",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
          >
            <FaRegQuestionCircle style={{ fontSize: "20px" }} />
            질문 ({questions.length})
          </h2>
          <button
              type="button"
              onClick={addQuestion}
              style={{
                padding: "10px 20px",
                backgroundColor: "#B89369",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#A67F5C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#B89369";
              }}
          >
            <FaPlus style={{ fontSize: "12px" }} />
            질문 추가
          </button>
        </div>

        {questions.length === 0 ? (
            <div
                style={{
                  padding: "60px 40px",
                  textAlign: "center",
                  backgroundColor: "#fff",
                  border: "1px solid rgba(184, 147, 105, 0.2)",
                  borderRadius: "12px",
                  color: "#B89369",
                }}
            >
              <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                    display: "flex",
                    justifyContent: "center",
                  }}
              >
                <FaRegQuestionCircle />
              </div>
              <p style={{ fontSize: "16px", margin: 0 }}>질문을 추가해주세요</p>
            </div>
        ) : (
            questions.map((question, qIndex) => (
                <div
                    key={qIndex}
                    style={{
                      marginBottom: "24px",
                      padding: "24px",
                      backgroundColor: "#fff",
                      border: "2px solid rgba(184, 147, 105, 0.2)",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                >
                  <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                  >
                    <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          margin: 0,
                          color: "#B89369",
                        }}
                    >
                      질문 {question.number}
                    </h3>
                    <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#c82333";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#dc3545";
                        }}
                    >
                      <FaTrash style={{ fontSize: "10px" }} />
                      삭제
                    </button>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#666",
                        }}
                    >
                      질문 내용 <span style={{ color: "#B89369" }}>*</span>
                    </label>
                    <input
                        type="text"
                        value={question.content}
                        onChange={(e) => updateQuestionContent(qIndex, e.target.value)}
                        placeholder="질문 내용을 입력하세요"
                        style={{
                          width: "100%",
                          padding: "10px",
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
                          e.currentTarget.style.borderColor =
                              "rgba(184, 147, 105, 0.3)";
                        }}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#666",
                        }}
                    >
                      질문 타입 <span style={{ color: "#B89369" }}>*</span>
                    </label>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                      >
                        <input
                            type="radio"
                            checked={question.type === "MULTIPLE_CHOICE"}
                            onChange={() =>
                                updateQuestionType(qIndex, "MULTIPLE_CHOICE")
                            }
                            style={{
                              marginRight: "6px",
                              accentColor: "#B89369",
                              cursor: "pointer",
                            }}
                        />
                        객관식
                      </label>
                      <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                      >
                        <input
                            type="radio"
                            checked={question.type === "SUBJECTIVE"}
                            onChange={() => updateQuestionType(qIndex, "SUBJECTIVE")}
                            style={{
                              marginRight: "6px",
                              accentColor: "#B89369",
                              cursor: "pointer",
                            }}
                        />
                        주관식
                      </label>
                    </div>
                  </div>
                  {question.type === "MULTIPLE_CHOICE" && (
                      <div>
                        <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "12px",
                            }}
                        >
                          <label
                              style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#666",
                              }}
                          >
                            선택지 ({question.choices.length})
                          </label>
                          <button
                              type="button"
                              onClick={() => addChoice(qIndex)}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "12px",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#218838";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#28a745";
                              }}
                          >
                            <FaPlus style={{ fontSize: "10px" }} />
                            선택지 추가
                          </button>
                        </div>
                        {question.choices.map((choice, cIndex) => (
                            <div
                                key={cIndex}
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  marginBottom: "8px",
                                  alignItems: "center",
                                }}
                            >
                    <span
                        style={{
                          minWidth: "24px",
                          fontSize: "14px",
                          color: "#B89369",
                          fontWeight: 500,
                        }}
                    >
                      {choice.number}.
                    </span>
                              <input
                                  type="text"
                                  value={choice.content}
                                  onChange={(e) =>
                                      updateChoiceContent(qIndex, cIndex, e.target.value)
                                  }
                                  placeholder="선택지 내용"
                                  style={{
                                    flex: 1,
                                    padding: "8px",
                                    border: "1px solid rgba(184, 147, 105, 0.3)",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    transition: "all 0.2s",
                                  }}
                                  onFocus={(e) => {
                                    e.currentTarget.style.borderColor = "#B89369";
                                    e.currentTarget.style.outline = "none";
                                  }}
                                  onBlur={(e) => {
                                    e.currentTarget.style.borderColor =
                                        "rgba(184, 147, 105, 0.3)";
                                  }}
                              />
                              <button
                                  type="button"
                                  onClick={() => removeChoice(qIndex, cIndex)}
                                  disabled={question.choices.length <= 2}
                                  style={{
                                    padding: "6px 10px",
                                    backgroundColor:
                                        question.choices.length <= 2 ? "#ccc" : "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    cursor:
                                        question.choices.length <= 2
                                            ? "not-allowed"
                                            : "pointer",
                                    transition: "all 0.2s",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (question.choices.length > 2) {
                                      e.currentTarget.style.backgroundColor = "#c82333";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (question.choices.length > 2) {
                                      e.currentTarget.style.backgroundColor = "#dc3545";
                                    }
                                  }}
                              >
                                <FaTrash style={{ fontSize: "10px" }} />
                                삭제
                              </button>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
            ))
        )}
      </section>
  );
}

export default SurveyCreateQuestion;
