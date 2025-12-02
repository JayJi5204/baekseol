// components/common/LoadingScreen.tsx
import type { FC, ReactNode } from "react";

interface LoadingScreenProps {
    message?: ReactNode;
    subMessage?: ReactNode;
}

export const LoadingScreen: FC<LoadingScreenProps> = ({
                                                          message = "잠시만 기다려 주세요",
                                                          subMessage = "데이터를 불러오는 중입니다...",
                                                      }) => {
    return (
        // ✅ 화면 전체를 덮는 오버레이
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
            {/* 안쪽 카드만 기존 그라디언트/흰 배경 느낌으로 */}
            <div className="bg-gradient-to-br from-[#F9F7F3] to-[#F3EDE3] px-4 py-6 rounded-3xl shadow-2xl max-w-md w-full">
                <div className="bg-white/90 backdrop-blur rounded-2xl px-8 py-10 w-full text-center space-y-6">
                    <div className="relative w-32 h-32 mx-auto">
                        {/* 동그란 로딩 스피너 */}
                        <div className="absolute inset-0 rounded-full border-4 border-[#B89369]/30 border-t-[#B89369] animate-spin" />
                        {/* 가운데 백설이 */}
                        <img
                            src="/images/waiting.jpg"
                            alt="기다리는 백설이"
                            className="w-24 h-24 object-contain mx-auto mt-4"
                        />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-[#B89369]">{message}</h2>
                        <p className="text-gray-600 text-sm">{subMessage}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
