// src/components/hompage/SurveySection.tsx
import React, { useRef } from "react";
import HomePageComponent from "./HomePageComponent";
import type { SurveyItemResDto } from "../../types/SurveyData";

interface SurveySectionProps {
    surveys: SurveyItemResDto[];
    loading: boolean;
    participatedMap?: Record<number, boolean>; // surveyId → 참여 여부
}

const CARD_WIDTH = 320;
const GAP = 24;

const SurveySection: React.FC<SurveySectionProps> = ({
                                                         surveys,
                                                         loading,
                                                         participatedMap,
                                                     }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollAmount = CARD_WIDTH + GAP;

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const { scrollLeft } = scrollRef.current;
        const next =
            direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
        scrollRef.current.scrollTo({ left: next, behavior: "smooth" });
    };

    return (
        <section className="relative">
            <div className="relative rounded-3xl bg-white border border-[#E2D7C7] shadow-md px-10 py-8">
                {/* 설문 카드 레일 */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scroll-smooth"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {loading ? (
                        <div className="flex items-center gap-3 text-gray-500 px-2 py-4">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                            <span className="text-sm font-medium">로딩 중...</span>
                        </div>
                    ) : surveys.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center py-12 text-center">
                            <p className="text-gray-400 text-sm">표시할 설문이 없습니다.</p>
                        </div>
                    ) : (
                        surveys.map((survey) => (
                            <div key={survey.surveyId} className="flex-shrink-0 w-80">
                                <HomePageComponent
                                    survey={survey}
                                    hasParticipated={participatedMap?.[survey.surveyId] ?? false}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* 좌우 버튼 – 카드 밖으로 반쯤 */}
                <button
                    type="button"
                    onClick={() => scroll("left")}
                    aria-label="이전 설문"
                    className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2
                     w-11 h-11 rounded-full bg-white border border-gray-200 text-gray-700 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
                    style={{ userSelect: "none" }}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={() => scroll("right")}
                    aria-label="다음 설문"
                    className="hidden md:flex items-center justify-center absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2
                     w-11 h-11 rounded-full bg-white border border-gray-200 text-gray-700 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
                    style={{ userSelect: "none" }}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default SurveySection;
