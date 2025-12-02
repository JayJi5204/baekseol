import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateSurveyRequest, Question } from "../../types/SurveyData";
import { createSurvey } from "../../api/SurveyApi";
import { userInfo } from "../../api/UserApi";
import SurveyCreateQuestion from "../../components/survey/SurveyCreateQuestion";
import SurveyCreateInfo from "../../components/survey/SurveyCreateInfo";
import { calculateTotalPointWithDetails } from "../../utils/calculateTotalPointWithDetails";
import SurveyPoint from "../../components/survey/SurveyPoint";
import { PointPurchaseModal } from "../../components/payment/PointPurchaseModal";
import { FaEdit } from "react-icons/fa";

function SurveyCreatePage() {
  const navigate = useNavigate();

  // 기본 정보 상태
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxResponse, setMaxResponse] = useState(100);
  const [reward, setReward] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [interestId, setInterestId] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);

  // 포인트 상태
  const [userPoint, setUserPoint] = useState(0);
  const [isLoadingPoint, setIsLoadingPoint] = useState(true);

  // 제출/결제 모달 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPointPurchaseOpen, setIsPointPurchaseOpen] = useState(false);
  const [pointSufficient, setPointSufficient] = useState(true);

  // 로컬 저장 여부 플래그
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  // 저장용 키
  const STORAGE_KEY = "draftSurvey";

  // 총 필요 포인트 계산
  const questionCnt = questions.length;
  const {
    total: totalRequiredPoint,
    fee,
    pointPerQuestion,
    pointPerResponse,
  } = calculateTotalPointWithDetails(questionCnt, maxResponse, reward);

  // 부족 포인트 (0 이하면 0)
  const shortagePoint = Math.max(totalRequiredPoint - userPoint, 0);

  // 1) 로컬스토리지에서 복구 (처음 한 번만)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setMaxResponse(data.maxResponse ?? 100);
        setReward(data.reward ?? 0);
        setDeadline(data.deadline || "");
        setInterestId(data.interestId ?? 1);
        setQuestions(data.questions ?? []);
      }
    } catch (error) {
      console.error("로컬스토리지 복구 실패", error);
    } finally {
      setIsDraftLoaded(true);
    }
  }, []);

  // 2) 복구가 끝난 이후부터만 로컬스토리지에 저장
  useEffect(() => {
    if (!isDraftLoaded) return;

    try {
      const dataToSave = {
        title,
        description,
        maxResponse,
        reward,
        deadline,
        interestId,
        questions,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("로컬스토리지 저장 실패", error);
    }
  }, [
    isDraftLoaded,
    title,
    description,
    maxResponse,
    reward,
    deadline,
    interestId,
    questions,
  ]);

  // 사용자 포인트 조회
  useEffect(() => {
    const fetchUserPoint = async () => {
      try {
        const res = await userInfo();
        setUserPoint(res.point || 0);
      } catch (error) {
        console.error("포인트 불러오기 실패", error);
      } finally {
        setIsLoadingPoint(false);
      }
    };
    fetchUserPoint();
  }, []);

  // SurveyPoint → 부모로 포인트 충분 여부 전달
  const handlePointSufficiencyChange = (isSufficient: boolean) => {
    setPointSufficient(isSufficient);
  };

  // 제출 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 포인트 부족하면 결제 모달 열고 바로 리턴
    if (!pointSufficient) {
      setIsPointPurchaseOpen(true);
      return;
    }

    if (!title.trim()) {
      alert("설문 제목을 입력해주세요.");
      return;
    }
    if (!description.trim()) {
      alert("설문 설명을 입력해주세요.");
      return;
    }
    if (!deadline) {
      alert("마감일을 선택해주세요.");
      return;
    }
    if (questions.length === 0) {
      alert("최소 1개의 질문을 추가해주세요.");
      return;
    }

    for (const question of questions) {
      if (!question.content.trim()) {
        alert(`${question.number}번 질문의 내용을 입력해주세요.`);
        return;
      }
      if (
          question.type === "SINGLE_CHOICE" ||
          question.type === "MULTIPLE_CHOICE"
      ) {
        if (question.choices.length < 2) {
          alert(
              `${question.number}번 질문에 최소 2개의 선택지를 추가해주세요.`
          );
          return;
        }
        for (const choice of question.choices) {
          if (!choice.content.trim()) {
            alert(
                `${question.number}번 질문의 ${choice.number}번 선택지 내용을 입력해주세요.`
            );
            return;
          }
        }
      }
    }

    const requestData: CreateSurveyRequest = {
      title,
      description,
      maxResponse,
      reward,
      deadline: `${deadline}T23:59:59`,
      interestId,
      questions,
    };

    setIsSubmitting(true);

    try {
      // 서버 기준으로도 포인트 충분한지 한 번 더 확인
      const updatedUser = await userInfo();
      if (updatedUser.point < totalRequiredPoint) {
        alert("충전 후에도 포인트가 부족합니다. 충전해주세요.");
        setIsSubmitting(false);
        setIsPointPurchaseOpen(true);
        setUserPoint(updatedUser.point);
        return;
      }

      await createSurvey(requestData);

      alert("설문이 성공적으로 등록되었습니다!");
      localStorage.removeItem(STORAGE_KEY);
      navigate("/surveys/my");
    } catch (error) {
      console.error("설문 등록 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#F3F1E5",
            padding: "40px 20px",
          }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                marginBottom: "32px",
                color: "#B89369",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
          >
            <FaEdit style={{ fontSize: "28px" }} />
            설문 등록
          </h1>

          <form onSubmit={handleSubmit}>
            <SurveyCreateInfo
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                maxResponse={maxResponse}
                setMaxResponse={setMaxResponse}
                reward={reward}
                setReward={setReward}
                deadline={deadline}
                setDeadline={setDeadline}
                interestId={interestId}
                setInterestId={setInterestId}
                userPoint={userPoint}
                isLoadingPoint={isLoadingPoint}
                questionCnt={questionCnt}
                setQuestionCnt={() => {}}
                fee={fee}
                pointPerQuestion={pointPerQuestion}
                pointPerResponse={pointPerResponse}
                totalRequiredPoint={totalRequiredPoint}
            />

            <SurveyCreateQuestion
                questions={questions}
                setQuestions={setQuestions}
            />

            <SurveyPoint
                userPoint={userPoint}
                reward={reward}
                maxResponse={maxResponse}
                questionCnt={questionCnt}
                isLoadingPoint={isLoadingPoint}
                onPointSufficiencyChange={handlePointSufficiencyChange}
            />

            <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                  paddingTop: "24px",
                  borderTop: "2px solid rgba(184, 147, 105, 0.2)",
                  marginTop: "20px",
                }}
            >
              <button
                  type="button"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                  style={{
                    padding: "14px 32px",
                    backgroundColor: "#fff",
                    color: "#B89369",
                    border: "2px solid #B89369",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 500,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.5 : 1,
                  }}
              >
                취소
              </button>
              <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "14px 32px",
                    backgroundColor: !isSubmitting ? "#B89369" : "#ccc",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 500,
                    cursor: !isSubmitting ? "pointer" : "not-allowed",
                  }}
              >
                {isSubmitting ? "등록 중..." : "설문 등록"}
              </button>
            </div>
          </form>

          <PointPurchaseModal
              isOpen={isPointPurchaseOpen}
              onClose={() => setIsPointPurchaseOpen(false)}
              shortagePoint={shortagePoint > 0 ? shortagePoint : undefined}
          />
        </div>
      </div>
  );
}

export default SurveyCreatePage;
