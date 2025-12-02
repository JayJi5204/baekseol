// components/payment/PointPurchaseModal.tsx
import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import type { TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import type { PointPackage } from "../../types/Payment";
import { FEE } from "../../types/Payment";
import useZustandUser from "../../zstore/useZustandUser";

const POINT_PACKAGES: PointPackage[] = [
  {
    points: 10000 - FEE,
    price: 10000,
    label: `${(10000 - FEE).toLocaleString()} 포인트`,
  },
  {
    points: 30000 - FEE,
    price: 30000,
    label: `${(30000 - FEE).toLocaleString()} 포인트`,
  },
  {
    points: 50000 - FEE,
    price: 50000,
    label: `${(50000 - FEE).toLocaleString()} 포인트`,
  },
  {
    points: 100000 - FEE,
    price: 100000,
    label: `${(100000 - FEE).toLocaleString()} 포인트`,
  },
];

interface PointPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 설문 페이지 등에서 부족 포인트 보여줄 때만 사용
  shortagePoint?: number;
}

const generateRandomString = (): string =>
    window.btoa(Math.random().toString()).slice(0, 20);

export const PointPurchaseModal: FC<PointPurchaseModalProps> = ({
                                                                  isOpen,
                                                                  onClose,
                                                                  shortagePoint,
                                                                }) => {
  const [selectedPackage, setSelectedPackage] = useState<PointPackage>(
      POINT_PACKAGES[1]
  );
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const paymentMethodWidgetRef = useRef<unknown>(null);
  const { user } = useZustandUser();

  const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
  const actualPrice = selectedPackage.price;

  // 모달 열릴 때 Toss 위젯 로딩
  useEffect(() => {
    if (!isOpen) return;

    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const newWidgets = tossPayments.widgets({ customerKey: ANONYMOUS });
      setWidgets(newWidgets);
    }

    fetchPaymentWidgets();
  }, [isOpen, clientKey]);

  // 부족 포인트가 있으면, 부족분 이상 패키지 자동 선택
  useEffect(() => {
    if (!shortagePoint || shortagePoint <= 0) return;

    const recommended =
        POINT_PACKAGES.find((pkg) => pkg.points >= shortagePoint) ??
        POINT_PACKAGES[POINT_PACKAGES.length - 1];

    setSelectedPackage(recommended);
  }, [shortagePoint]);

  // 결제 위젯 렌더링
  useEffect(() => {
    if (!widgets || !showPaymentForm) {
      return;
    }

    async function renderPaymentWidgets() {
      if (!widgets) return;

      await widgets.setAmount({
        currency: "KRW",
        value: actualPrice,
      });

      const [paymentMethodWidget] = await Promise.all([
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      paymentMethodWidgetRef.current = paymentMethodWidget;
      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets, showPaymentForm, actualPrice]);

  const handlePayment = async (): Promise<void> => {
    if (!widgets) return;

    setIsLoading(true);
    try {
      // 항상 현재 페이지로 돌아오도록 redirect 쿼리 붙이기
      const currentPath = window.location.pathname + window.location.search;

      await widgets.requestPayment({
        orderId: generateRandomString(),
        orderName: `${selectedPackage.points}포인트 충전`,
        customerName: user?.username || "Anonymous",
        customerEmail: "customer@example.com",
        successUrl: `${window.location.origin}/payment/success?redirect=${encodeURIComponent(
            currentPath
        )}`,
        failUrl: `${window.location.origin}/payment/fail?redirect=${encodeURIComponent(
            currentPath
        )}`,
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 my-4 scale-75 origin-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#B89369] mb-1">
              포인트 충전
            </h2>
            <p className="text-gray-500 text-sm">
              {shortagePoint && shortagePoint > 0
                  ? "부족한 포인트를 충전해 설문을 등록해보세요."
                  : "필요한 포인트를 선택해주세요"}
            </p>
          </div>

          {/* 부족 포인트 안내 배너 */}
          {shortagePoint && shortagePoint > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 flex items-center gap-2">
                <span>⚠️</span>
                <div>
                  <div>
                    설문 등록까지{" "}
                    <span className="font-semibold">
                  {shortagePoint.toLocaleString()}P
                </span>{" "}
                    부족합니다.
                  </div>
                  <div className="text-xs text-red-500 mt-1">
                    아래 금액 중 부족분 이상을 충전하면 설문 등록이 가능합니다.
                  </div>
                </div>
              </div>
          )}

          {!showPaymentForm ? (
              <>
                <div className="space-y-3 border-t border-b border-gray-200 py-6">
                  {POINT_PACKAGES.map((pkg) => (
                      <button
                          key={pkg.points}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              selectedPackage.points === pkg.points
                                  ? "border-[#B89369] bg-[#F9F7F3]"
                                  : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                      <span className="font-semibold text-gray-800 block">
                        {pkg.label}
                      </span>
                            <span className="text-xs text-gray-500">
                        결제 {pkg.price.toLocaleString()}원
                      </span>
                          </div>
                          <span className="text-[#B89369] font-bold">
                      {pkg.points.toLocaleString()}P
                    </span>
                        </div>
                      </button>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-[#F9F7F3] to-[#F3EDE3] p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>결제 금액</span>
                    <span>{selectedPackage.price.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600 font-semibold">
                    <span>🚨 수수료 차감</span>
                    <span>-{FEE.toLocaleString()}원</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-[#B89369] text-lg">
                    <span>충전 포인트</span>
                    <span>{selectedPackage.points.toLocaleString()}P</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    ※ 실제 충전은 수수료 {FEE}원을 제외한{" "}
                    {selectedPackage.points.toLocaleString()}P 입니다.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                      onClick={onClose}
                      className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
                  >
                    취소
                  </button>
                  <button
                      onClick={() => setShowPaymentForm(true)}
                      className="flex-1 py-3 rounded-lg bg-[#B89369] text-white font-semibold hover:bg-[#A67F5C] transition-all"
                  >
                    결제하기
                  </button>
                </div>
              </>
          ) : (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    결제 수단 선택
                  </h3>
                  <div id="payment-method" className="w-full mb-4" />
                  <div id="agreement" className="w-full mb-4" />
                </div>

                <div className="bg-gradient-to-br from-[#F9F7F3] to-[#F3EDE3] p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>결제 금액</span>
                    <span>{selectedPackage.price.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600 font-semibold">
                    <span>수수료 차감</span>
                    <span>-{FEE.toLocaleString()}원</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-[#B89369]">
                    <span>실제 충전</span>
                    <span>{selectedPackage.points.toLocaleString()}P</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                      onClick={() => setShowPaymentForm(false)}
                      disabled={isLoading || !ready}
                      className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    뒤로가기
                  </button>
                  <button
                      onClick={handlePayment}
                      disabled={isLoading || !ready}
                      className="flex-1 py-3 rounded-lg bg-[#B89369] text-white font-semibold hover:bg-[#A67F5C] transition-all disabled:opacity-50"
                  >
                    {isLoading ? "처리 중..." : ready ? "결제하기" : "로딩 중..."}
                  </button>
                </div>
              </>
          )}
        </div>
      </div>
  );
};
