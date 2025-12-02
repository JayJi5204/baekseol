// pages/payment/PaymentFailPage.tsx
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { FC } from "react";

export const PaymentFailPage: FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const redirect = searchParams.get("redirect") || "/mypage";

    // ✅ 성공 페이지와 동일하게 ?open 제거한 안전한 redirect
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

    const code = searchParams.get("code");
    const message = searchParams.get("message");

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F9F7F3] to-[#F3EDE3] px-4">
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6 text-center">
                <h1 className="text-3xl font-bold text-red-600">결제 실패</h1>
                <div className="flex justify-center mb-2">
                    {/* ✅ 원모양 없이 슬픈 이미지 크게 */}
                    <img
                        src="/images/sad.png"
                        alt="슬픈 백설이"
                        className="w-24 h-24 object-contain mx-auto"
                    />
                </div>
                <p className="text-gray-600 text-sm">
                    결제 과정에서 오류가 발생했어요. 아래 내용을 확인해 주세요.
                </p>

                <div className="bg-red-50 p-4 rounded-lg space-y-2 text-left border border-red-100">
                    <p className="text-sm">
                        <span className="font-semibold text-gray-700">에러 코드</span>
                        <span className="text-red-600 ml-2">
              {code || "-"}
            </span>
                    </p>
                    <p className="text-sm">
                        <span className="font-semibold text-gray-700">실패 사유</span>
                        <span className="text-red-600 ml-2">
              {message || "알 수 없는 오류가 발생했습니다."}
            </span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {/* 설문 / 마이페이지 등 redirect 기준으로 복귀 */}
                    <button
                        onClick={() => navigate(safeRedirect, { replace: true })}
                        className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
                    >
                        돌아가기
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="flex-1 py-3 rounded-lg bg-[#B89369] text-white font-semibold hover:bg-[#A67F5C] transition-all"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailPage;
