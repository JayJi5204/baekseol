// src/components/hompage/BannerSection.tsx

interface BannerSectionProps {
    onClickPrimary: () => void; // "지금 시작하기"
}

function BannerSection({ onClickPrimary }: BannerSectionProps) {
    return (
        <section className="relative w-full bg-[#B89369]">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
                {/* 왼쪽 텍스트 */}
                <div className="flex-1">
                    <div className="mb-3">
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                        일상처럼 편하게
                        <span className="block mt-1 text-[#FFE7C0]">설문에 참여해 보세요</span>
                    </h1>
                    <p className="text-sm md:text-base text-white/90 mb-7 leading-relaxed max-w-xl">
                        짧은 질문에 답하면서 포인트를 모을 수 있습니다. <br/>
                        지금 바로 시작해 보고, 나에게 맞는 설문을 찾아보세요.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            type="button"
                            onClick={onClickPrimary}
                            className="px-9 py-3.5 rounded-full bg-white text-[#9A6A35] text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#FDF7EE] transition-colors"
                        >
                            지금 시작하기
                        </button>
                    </div>
                </div>

                {/* 오른쪽 캐릭터 – 크기 키우고 배치 정돈 */}
                <div className="flex-1 flex justify-center md:justify-end">
                    <div className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] flex items-center justify-center">
                        <img
                            src="/images/survey_character.png"
                            alt="설문 캐릭터"
                            className="w-full h-full max-w-[320px] max-h-[320px] object-contain animate-bounce drop-shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                            style={{ animationDuration: "2.5s" }}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BannerSection;
