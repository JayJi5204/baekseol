// WithdrawalModal.tsx
import { useState, type FC } from "react";
import useZustandUser from "../../zstore/useZustandUser";
import * as paymentApi from "../../api/PaymentApi";
import type { Bank } from "../../types/Payment";
import { FEE } from "../../types/Payment";
import { AxiosError } from "axios";
import LoadingScreen from "../../components/common/LoadingScreen";

const BANK_LIST: Bank[] = [
  { code: "004", name: "국민은행" },
  { code: "011", name: "농협은행" },
  { code: "020", name: "우리은행" },
  { code: "088", name: "신한은행" },
  { code: "105", name: "하나은행" },
  { code: "090", name: "카카오뱅크" },
  { code: "098", name: "토스뱅크" },
];

interface WithdrawalFormData {
  amount: string;
  bankCode: string;
  account: string;
}

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawalModal: FC<WithdrawalModalProps> = ({
                                                            isOpen,
                                                            onClose,
                                                          }) => {
  const { user, refetchUser } = useZustandUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<WithdrawalFormData>({
    amount: "",
    bankCode: "",
    account: "",
  });

  // ✅ 1. 열려있지 않으면 아예 렌더하지 않음 (LoadingScreen 도 안 뜸)
  if (!isOpen) return null;

  // ✅ 2. 열려 있고, 환급 요청 중일 때만 전체 로딩 화면으로 전환
  if (isLoading) {
    return (
        <LoadingScreen
            message="환급 요청 처리 중이에요"
            subMessage="백설이가 송금 준비 중입니다..."
        />
    );
  }

  const handleSubmit = async (
      e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.amount || !formData.bankCode || !formData.account) {
      setError("모든 칸을 입력해주세요");
      return;
    }

    const amount = Number(formData.amount);
    if (amount <= 0) {
      setError("유효한 금액을 입력해주세요");
      return;
    }

    if (amount <= FEE) {
      setError(`최소 ${(FEE + 1).toLocaleString()}원 이상 환급할 수 있습니다`);
      return;
    }

    if (user && user.points < amount) {
      setError("보유한 포인트보다 많은 금액을 환급할 수 없습니다");
      return;
    }

    if (formData.account.length < 10) {
      setError("유효한 계좌번호를 입력해주세요 (최소 10자리)");
      return;
    }

    setIsLoading(true);
    try {
      await paymentApi.requestWithdrawal({
        amount: amount,
        bankCode: formData.bankCode,
        account: formData.account,
      });

      setSuccessMessage("환급 요청이 완료되었습니다");
      setFormData({ amount: "", bankCode: "", account: "" });

      await refetchUser();

      // ✅ 성공 시: 로딩 화면을 잠깐 보여주고 닫기
      setTimeout(() => {
        setSuccessMessage(null);
        setIsLoading(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("환급 요청 실패:", error);

      if (error instanceof AxiosError) {
        const errorMessage =
            error.response?.data?.message || "환급 요청에 실패했습니다";
        setError(errorMessage);
      } else {
        setError("환급 요청에 실패했습니다");
      }

      // ✅ 실패 시: 로딩 해제 후 모달에 에러 표시
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ amount: "", bankCode: "", account: "" });
      setError(null);
      setSuccessMessage(null);
      onClose();
    }
  };

  return (
      <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
      >
        <div
            className="bg-white rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
          <button
              onClick={handleClose}
              disabled={isLoading}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-[#B89369] mb-2">환급 신청</h2>
          <p className="text-gray-600 text-sm mb-6">
            보유 포인트:{" "}
            <span className="font-bold text-[#B89369]">
            {user?.points?.toLocaleString() || 0}P
          </span>
          </p>

          {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-green-700 text-sm">
                ✅ {successMessage}
              </div>
          )}

          {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-600 text-sm">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                환급 금액 (포인트)
              </label>
              <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="환급 금액을 입력해주세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B89369]"
                  disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                수수료 {FEE}원이 차감됩니다
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                은행명
              </label>
              <select
                  value={formData.bankCode}
                  onChange={(e) =>
                      setFormData({ ...formData, bankCode: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B89369]"
                  disabled={isLoading}
              >
                <option value="">은행을 선택해주세요</option>
                {BANK_LIST.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                계좌번호
              </label>
              <input
                  type="text"
                  value={formData.account}
                  onChange={(e) =>
                      setFormData({
                        ...formData,
                        account: e.target.value.replace(/[^0-9]/g, ""),
                      })
                  }
                  placeholder="계좌번호 (하이픈 제외)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B89369]"
                  disabled={isLoading}
              />
            </div>

            {formData.amount && Number(formData.amount) > 0 && (
                <div className="bg-[#F9F7F3] p-4 rounded-lg">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>신청 금액</span>
                    <span>{Number(formData.amount).toLocaleString()}P</span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600 font-semibold mb-2">
                    <span>🚨 수수료 차감</span>
                    <span>- {FEE}원</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-[#B89369]">
                    <span>실제 환급액</span>
                    <span>
                  {(Number(formData.amount) - FEE).toLocaleString()}원
                </span>
                  </div>
                </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="cursor-pointer flex-1 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 disabled:opacity-50 transition-all"
              >
                취소
              </button>
              <button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer flex-1 py-3 rounded-lg bg-[#B89369] text-white font-semibold hover:bg-[#A67F5C] disabled:opacity-50 transition-all"
              >
                {isLoading ? "처리 중..." : "환급 신청"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};
