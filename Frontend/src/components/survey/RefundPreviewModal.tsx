// components/common/RefundPreviewModal.tsx
import type { SurveyRefundPreviewResponse } from "../../types/SurveyData";

interface RefundPreviewModalProps {
    open: boolean;
    surveyTitle: string;
    preview: SurveyRefundPreviewResponse | null;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

function RefundPreviewModal({
                                open,
                                surveyTitle,
                                preview,
                                loading = false,
                                onConfirm,
                                onCancel,
                            }: RefundPreviewModalProps) {
    if (!open || !preview) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 my-4 scale-75 origin-center">
                {/* 상단: 우는 백설이 + 제목 */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#B89369] mb-1">
                        설문 내리기
                    </h2>
                    <p className="text-gray-500 text-sm">
                        정말 설문을 내리시겠어요?
                    </p>
                    <div className="flex justify-center mb-4">
                        <img
                            src="/images/sad.png"
                            alt="우는 백설이"
                            className="w-20 h-20 object-contain"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                        />
                    </div>
                </div>

                {/* 설문 제목 */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600 mb-1">설문 제목</p>
                    <p className="font-semibold text-gray-800">{surveyTitle}</p>
                </div>

                {/* 환불 정보 카드 */}
                <div className="bg-gradient-to-br from-[#F9F7F3] to-[#F3EDE3] p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>총 결제 금액</span>
                        <span>{preview.totalPaid.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>플랫폼 수수료</span>
                        <span>-{preview.platformFee.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>현재 참여 인원</span>
                        <span>{preview.participantCount}명</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>참여자 보상 지급</span>
                        <span>-{preview.totalRewardPaid.toLocaleString()}원</span>
                    </div>

                    <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-[#B89369] text-lg">
                        <span>예상 환불 금액</span>
                        <span>{preview.refundAmount.toLocaleString()}P</span>
                    </div>

                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        ※ 위 금액이 계정 포인트로 환불됩니다.
                    </p>
                </div>

                {/* 경고 메시지 */}
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 flex items-start gap-2">
                    <span className="text-base">⚠️</span>
                    <div className="flex-1">
                        <p className="font-semibold mb-1">주의사항</p>
                        <p className="text-xs leading-relaxed">
                            설문을 내리면 더 이상 응답을 받을 수 없으며, 복구할 수 없습니다.
                        </p>
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 py-3 rounded-lg bg-[#B89369] text-white font-semibold hover:bg-[#A67F5C] transition-all disabled:opacity-50"
                    >
                        {loading ? "처리 중..." : "설문 내리기"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RefundPreviewModal;
