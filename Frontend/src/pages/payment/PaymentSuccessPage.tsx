// pages/payment/PaymentSuccessPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useZustandUser from "../../zstore/useZustandUser";
import * as paymentApi from "../../api/PaymentApi";
import LoadingScreen from "../../components/common/LoadingScreen";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, refetchUser } = useZustandUser();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amountStr = searchParams.get("amount");
  const amount = amountStr ? Number(amountStr) : 0;

  // 모달/설문 등에서 붙여준 redirect (없으면 기본 마이페이지)
  const redirect = searchParams.get("redirect") || "/mypage";

  // ✅ redirect 에 ?open=... 붙어있으면 제거해서 모달 다시 안 뜨게
  const safeRedirect = useMemo(() => {
    try {
      const url = new URL(redirect, window.location.origin);
      url.searchParams.delete("open");
      const path = url.pathname + url.search + url.hash;
      return path || "/mypage";
    } catch {
      return redirect || "/mypage";
    }
  }, [redirect]);

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      navigate("/", { replace: true });
      return;
    }
    confirmPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentKey, orderId, amount]);

  const confirmPayment = async () => {
    try {
      await paymentApi.confirmPayment({
        paymentKey: paymentKey!,
        orderId: orderId!,
        orderName: "포인트 충전",
        amount,
      });

      await refetchUser();
      setIsConfirmed(true);
    } catch (error) {
      console.error("결제 확인 실패:", error);
      navigate(
          `/payment/fail?redirect=${encodeURIComponent(safeRedirect)}`,
          { replace: true }
      );
    } finally {
      setLoading(false);
    }
  };

  const currentPoint = user?.points ?? 0;

  if (loading) {
    return (
        <LoadingScreen
            message="결제를 완료했어요"
            subMessage="포인트가 적립 중입니다..."
        />
    );
  }

  if (!isConfirmed) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9F7F3] to-[#F3EDE3] px-4">
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg px-8 py-10 max-w-md w-full text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">결제 확인 실패</h2>
            <p className="text-gray-600 text-sm">
              결제 내역 확인에 실패했어요. 잠시 후 다시 시도해 주세요.
            </p>
            <button
                onClick={() => navigate("/", { replace: true })}
                className="mt-2 px-6 py-2 bg-[#B89369] text-white rounded-lg font-semibold hover:bg-[#A67F5C] transition"
            >
              홈으로
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9F7F3] to-[#F3EDE3] px-4">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl px-10 py-10 max-w-md w-full text-center space-y-6">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold text-emerald-600">
              결제가 완료됐어요
            </h2>
            {/* ✅ 원모양 빼고 큰 이미지 */}
            <img
                src="/images/baekseolpng.png"
                alt="귀여운 백설이"
                className="w-24 h-24 object-contain mx-auto"
            />
            <p className="text-gray-600 text-sm">
              충전하신 포인트는 바로 설문 참여에 사용하실 수 있어요.
            </p>
          </div>

          <div className="bg-[#F9F7F3] rounded-xl px-5 py-4 text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">충전 금액</span>
              <span className="font-semibold text-gray-900">
              {amount.toLocaleString()}원
            </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">현재 포인트</span>
              <span className="font-semibold text-[#B89369]">
              {currentPoint.toLocaleString()}P
            </span>
            </div>
          </div>

          <button
              onClick={() => navigate(safeRedirect, { replace: true })}
              className="w-full px-6 py-3 bg-[#B89369] text-white rounded-xl font-semibold hover:bg-[#A67F5C] transition shadow-sm"
          >
            돌아가기
          </button>

          <button
              onClick={() => navigate("/mypage", { replace: true })}
              className="w-full text-xs text-gray-500 underline underline-offset-2 mt-1"
          >
            마이페이지에서 내역 확인하기
          </button>
        </div>
      </div>
  );
}

export default PaymentSuccessPage;
