// src/components/survey/SurveyQuestionList.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSurveyById,
  getSurveyQuestions,
  participateSurvey,
  checkParticipation,
} from "../../api/SurveyApi";
import { getParticipantStatistics } from "../../api/SurveyStatisticsApi";
import type {
  AnswerReqDto,
  SurveyDetailResDto,
  QuestionResDto,
  QuestionType,
  ParticipantStatistics,
} from "../../types/SurveyData";
import RealtimeParticipantStats from "./RealtimeParticipantStats";
import {
  FaRegClipboard,
  FaRegMoneyBillAlt,
  FaRegListAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

function SurveyQuestionList() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [surveyInfo, setSurveyInfo] = useState<SurveyDetailResDto | null>(
      null
  );
  const [questions, setQuestions] = useState<QuestionResDto[]>([]);
  const [answers, setAnswers] = useState<Map<number, AnswerReqDto>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialStats, setInitialStats] =
      useState<ParticipantStatistics | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const participationResponse = await checkParticipation(Number(id));
        const hasParticipated = participationResponse.data;

        if (hasParticipated) {
          alert("이미 참여한 설문입니다.");
          navigate("/surveys");
          return;
        }

        const infoResponse = await getSurveyById(Number(id));
        const questionsResponse = await getSurveyQuestions(Number(id));
        const statsResponse = await getParticipantStatistics(Number(id));

        setSurveyInfo(infoResponse.data);
        setQuestions(questionsResponse.data);
        setInitialStats(statsResponse as ParticipantStatistics);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, navigate]);

  const handleSingleChoice = (
      questionNumber: number,
      questionType: QuestionType,
      choiceNumber: number
  ) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionNumber, {
      number: questionNumber,
      questionType: questionType,
      content: "",
      answerChoices: [choiceNumber],
    });
    setAnswers(newAnswers);
  };

  const handleMultipleChoice = (
      questionNumber: number,
      questionType: QuestionType,
      choiceNumber: number
  ) => {
    const newAnswers = new Map(answers);
    const currentAnswer = newAnswers.get(questionNumber);

    if (currentAnswer) {
      const choices = currentAnswer.answerChoices;
      const index = choices.indexOf(choiceNumber);

      if (index > -1) choices.splice(index, 1);
      else choices.push(choiceNumber);

      newAnswers.set(questionNumber, {
        ...currentAnswer,
        answerChoices: [...choices],
      });
    } else {
      newAnswers.set(questionNumber, {
        number: questionNumber,
        questionType: questionType,
        content: "",
        answerChoices: [choiceNumber],
      });
    }

    setAnswers(newAnswers);
  };

  const handleSubjective = (
      questionNumber: number,
      questionType: QuestionType,
      content: string
  ) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionNumber, {
      number: questionNumber,
      questionType: questionType,
      content,
      answerChoices: [],
    });
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!surveyInfo || !id) return;

    if (answers.size !== surveyInfo.questionCnt) {
      alert(
          `모든 질문에 답변해주세요. (${answers.size}/${surveyInfo.questionCnt})`
      );
      return;
    }

    for (const [questionNumber, answer] of answers.entries()) {
      const question = questions.find((q) => q.number === questionNumber);
      if (!question) continue;

      if (question.type === "SUBJECTIVE" && !answer.content.trim()) {
        alert(`${questionNumber}번 질문의 답변을 입력해주세요.`);
        return;
      } else if (
          question.type !== "SUBJECTIVE" &&
          answer.answerChoices.length === 0
      ) {
        alert(`${questionNumber}번 질문의 답변을 선택해주세요.`);
        return;
      }
    }

    const confirmed = window.confirm(
        "설문을 제출하시겠습니까?\n제출 후에는 수정할 수 없습니다."
    );

    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const submitData = { answers: Array.from(answers.values()) };
      await participateSurvey(Number(id), submitData);
      alert("설문 참여가 완료되었습니다!");
      navigate("/surveys");
    } catch (error) {
      console.error("설문 제출 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89369]" />
          <div className="text-lg text-[#B89369]">확인 중...</div>
        </div>
    );
  }

  if (!surveyInfo || questions.length === 0) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-4xl mb-4 flex justify-center">
            <FaRegClipboard style={{ fontSize: "64px", color: "#B89369" }} />
          </div>
          <h2 className="text-xl font-semibold text-gray-600">
            설문을 찾을 수 없습니다.
          </h2>
        </div>
    );
  }

  if (surveyInfo.state !== "IN_PROCESS") {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-4xl mb-4 flex justify-center">
            <FaExclamationTriangle
                style={{ fontSize: "64px", color: "#B89369" }}
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            종료된 설문입니다.
          </h2>
          <button
              onClick={() => navigate("/surveys")}
              className="px-6 py-3 bg-[#B89369] text-white rounded-lg hover:bg-[#A67F5C] transition-colors font-medium"
          >
            목록으로 돌아가기
          </button>
        </div>
    );
  }

  return (
      <>
        <RealtimeParticipantStats
            surveyId={Number(id)}
            initialStats={initialStats}
            maxResponseFallback={surveyInfo.maxResponse}
        />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
              onClick={() => navigate(`/surveys/${id}`)}
              className="mb-4 px-4 py-2 bg-white text-[#B89369] border border-[#B89369]/30 rounded-lg hover:bg-[#F3F1E5] transition-all font-medium flex items-center gap-2"
          >
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
              />
            </svg>
            상세 정보로 돌아가기
          </button>

          <div className="bg-white border border-[#B89369]/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#B89369] mb-2">
                  {surveyInfo.title}
                </h1>
                <p className="text-gray-600 mb-4">{surveyInfo.description}</p>
                <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-[#B89369] font-semibold">
                  <FaRegMoneyBillAlt />
                  {surveyInfo.reward.toLocaleString()}P
                </span>
                  <span className="flex items-center gap-1 text-gray-500">
                  <FaRegListAlt />총 {surveyInfo.questionCnt}개 질문
                </span>
                  <span className="text-gray-500">
                  진행률: {answers.size}/{surveyInfo.questionCnt}
                </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question) => {
              const currentAnswer = answers.get(question.number);
              return (
                  <div
                      key={question.number}
                      className="bg-white border border-[#B89369]/20 rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#B89369] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {question.number}
                  </span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {question.content}
                        </h3>
                        <span className="text-sm text-gray-500">
                      {question.type === "SINGLE_CHOICE" && "단일 선택"}
                          {question.type === "MULTIPLE_CHOICE" &&
                              "다중 선택 (복수 응답 가능)"}
                          {question.type === "SUBJECTIVE" && "주관식"}
                    </span>
                      </div>
                    </div>

                    {question.type === "SINGLE_CHOICE" ? (
                        <div className="space-y-2 pl-11">
                          {question.choices.map((choice) => (
                              <label
                                  key={choice.number}
                                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                      currentAnswer?.answerChoices.includes(choice.number)
                                          ? "border-[#B89369] bg-[#F3F1E5]"
                                          : "border-gray-200 hover:border-[#B89369]/50 hover:bg-gray-50"
                                  }`}
                              >
                                <input
                                    type="radio"
                                    name={`question-${question.number}`}
                                    value={choice.number}
                                    checked={currentAnswer?.answerChoices.includes(
                                        choice.number
                                    )}
                                    onChange={() =>
                                        handleSingleChoice(
                                            question.number,
                                            question.type,
                                            choice.number
                                        )
                                    }
                                    className="w-5 h-5 text-[#B89369] focus:ring-[#B89369] cursor-pointer"
                                    style={{ accentColor: "#B89369" }}
                                />
                                <span className="ml-3 text-gray-700">
                          {choice.content}
                        </span>
                              </label>
                          ))}
                        </div>
                    ) : question.type === "MULTIPLE_CHOICE" ? (
                        <div className="space-y-2 pl-11">
                          {question.choices.map((choice) => (
                              <label
                                  key={choice.number}
                                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                      currentAnswer?.answerChoices.includes(choice.number)
                                          ? "border-[#B89369] bg-[#F3F1E5]"
                                          : "border-gray-200 hover:border-[#B89369]/50 hover:bg-gray-50"
                                  }`}
                              >
                                <input
                                    type="checkbox"
                                    value={choice.number}
                                    checked={currentAnswer?.answerChoices.includes(
                                        choice.number
                                    )}
                                    onChange={() =>
                                        handleMultipleChoice(
                                            question.number,
                                            question.type,
                                            choice.number
                                        )
                                    }
                                    className="w-5 h-5 text-[#B89369] focus:ring-[#B89369] cursor-pointer rounded"
                                    style={{ accentColor: "#B89369" }}
                                />
                                <span className="ml-3 text-gray-700">
                          {choice.content}
                        </span>
                              </label>
                          ))}
                        </div>
                    ) : (
                        <div className="pl-11">
                    <textarea
                        value={currentAnswer?.content ?? ""}
                        onChange={(e) =>
                            handleSubjective(
                                question.number,
                                question.type,
                                e.target.value
                            )
                        }
                        placeholder="답변을 입력해주세요..."
                        rows={4}
                        className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-[#B89369] focus:outline-none transition-all resize-none"
                    />
                        </div>
                    )}
                  </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
                onClick={() => navigate(`/surveys/${id}`)}
                disabled={isSubmitting}
                className="px-8 py-3 bg-white text-[#B89369] border-2 border-[#B89369] rounded-lg hover:bg-[#F3F1E5] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
                onClick={handleSubmit}
                disabled={isSubmitting || answers.size !== surveyInfo.questionCnt}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    isSubmitting || answers.size !== surveyInfo.questionCnt
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#B89369] text-white hover:bg-[#A67F5C] shadow-sm hover:shadow-md"
                }`}
            >
              {isSubmitting ? (
                  <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                제출 중...
              </span>
              ) : (
                  `제출하기 (${answers.size}/${surveyInfo.questionCnt})`
              )}
            </button>
          </div>
        </div>
      </>
  );
}

export default SurveyQuestionList;
