import { NavLink, useNavigate } from "react-router";
import useLogin from "../hooks/useLogin";
import { FaClipboardList, FaEdit } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const { loginState, doLogout } = useLogin();

  const isLoggedIn = !!loginState?.accessToken;
  const username = loginState?.username ?? "";

  const handleLogout = () => {
    doLogout();
    navigate("/");
  };

  // 설문 등록 클릭 핸들러
  const handleSurveyCreate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("로그인이 필요한 서비스입니다.");
      navigate("/users/login");
    }
  };

  return (
      <nav className="bg-[#F3F1E5] shadow-sm border-b border-[#B89369]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 & 네비게이션 */}
            <div className="flex items-center space-x-8">
              {/* 로고 - 이미지와 텍스트 정렬 */}
              <div className="flex-shrink-0">
                <NavLink
                    to="/"
                    className="inline-flex items-center gap-2 group transition-transform hover:scale-105"
                >
                  <img
                      src="/images/survey_character.png"
                      alt="백설이"
                      className="w-9 h-9 object-contain transition-transform group-hover:rotate-12"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                  />
                  <span
                      className="text-2xl font-bold text-[#B89369] leading-none transition-colors group-hover:text-[#A67F5C]"
                  >
    백설
  </span>
                </NavLink>

              </div>

              {/* 네비게이션 메뉴 */}
              <ul className="flex items-center space-x-1">
                <li>
                  <NavLink
                      to="/surveys"
                      className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all text-[#B89369] hover:bg-[#B89369]/10 hover:scale-105"
                  >
                    <FaClipboardList className="text-base transition-transform group-hover:scale-110" />
                    <span>설문 조사 참여</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to="/surveys/my"
                      onClick={handleSurveyCreate}
                      className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all text-[#B89369] hover:bg-[#B89369]/10 hover:scale-105"
                  >
                    <FaEdit className="text-base transition-transform group-hover:scale-110" />
                    <span>설문 조사 등록</span>
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* 로그인 / 로그아웃 + 닉네임 표시 영역 */}
            <div className="flex items-center space-x-4">
              {isLoggedIn && (
                  <span className="text-[#B89369] text-sm">
                <span className="font-bold">{username}</span> 님
              </span>
              )}
              {isLoggedIn && (
                  <NavLink
                      to={`/mypage`}
                      className="px-5 py-2 bg-[#B89369] text-white rounded-lg text-sm font-medium hover:bg-[#A67F5C] hover:scale-105 transition-all shadow-sm hover:shadow-md"
                  >
                    마이페이지
                  </NavLink>
              )}
              {isLoggedIn ? (
                  <button
                      onClick={handleLogout}
                      className="px-5 py-2 bg-[#B89369] text-white rounded-lg text-sm font-medium hover:bg-[#A67F5C] hover:scale-105 transition-all shadow-sm hover:shadow-md"
                  >
                    로그아웃
                  </button>
              ) : (
                  <NavLink
                      to="/users/login"
                      className="px-5 py-2 bg-[#B89369] text-white rounded-lg text-sm font-medium hover:bg-[#A67F5C] hover:scale-105 transition-all shadow-sm hover:shadow-md"
                  >
                    로그인
                  </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
}

export default Header;
