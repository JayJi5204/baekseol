function Footer() {
  return (
    <footer className="bg-[#F3F1E5] text-gray-800 mt-20 border-t border-[#B89369]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 브랜드 소개 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">
              <span className="text-[#B89369]">백설</span>
            </h3>
            <p className="text-sm text-gray-600">
              신뢰할 수 있는 설문조사 플랫폼
            </p>
          </div>

          {/* 팀 정보 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">팀 정보</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#B89369] rounded-full"></span>
                <span>
                  팀명:{" "}
                  <span className="text-[#B89369] font-medium">조사병단</span>
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#B89369] rounded-full"></span>
                <span>
                  팀장:{" "}
                  <span className="text-gray-800 font-medium">지성현</span>
                </span>
              </li>
            </ul>
          </div>

          {/* 팀원 정보 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">팀원</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-[#B89369]">•</span>
                <span>김태현</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#B89369]">•</span>
                <span>유성민</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#B89369]">•</span>
                <span>강건</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#B89369]">•</span>
                <span>문병화</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#B89369]">•</span>
                <span>한경훈</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 구분선 - 전체 너비 */}
      <div className="border-t border-[#B89369]/30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 space-y-4 md:space-y-0">
          <p>&copy; 2025 PollSurvey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
