// components/user/LoginComponent.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import useZustandUser from "../../zstore/useZustandUser";

function LoginComponent() {
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const { login, status, error, errorField } = useZustandUser();

  useEffect(() => {
    if (status === "success") {
      navigate("/");
    }
  }, [status, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, pw);
  };

  return (
    <div className="min-h-screen bg-[#F3F1E5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 로고 및 제목 */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-[#B89369] mb-3">백설</h1>
          <p className="text-base text-gray-600">
            설문조사 플랫폼에 오신 것을 환영합니다
          </p>
        </div>

        {/* 로그인 폼 카드 */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#B89369]/20 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* 서버 에러 메시지 */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* 닉네임 입력 */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                닉네임
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 outline-none transition-all
                  ${
                    errorField === "username"
                      ? "border-red-500 focus:ring-red-400 focus:border-red-500"
                      : "border-[#B89369]/30 focus:ring-[#B89369]/30 focus:border-[#B89369]"
                  }`}
                placeholder="닉네임을 입력하세요"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 outline-none transition-all
                  ${
                    errorField === "password"
                      ? "border-red-500 focus:ring-red-400 focus:border-red-500"
                      : "border-[#B89369]/30 focus:ring-[#B89369]/30 focus:border-[#B89369]"
                  }`}
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {/* 아이디/비밀번호 찾기 링크 추가 ✅ */}
            <div className="flex items-center justify-end gap-2 text-sm">
              <Link
                to="/users/findid"
                className="text-[#B89369] transition-colors"
              >
                아이디 찾기
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/users/sendemail"
                className="text-[#B89369] transition-colors"
              >
                비밀번호 찾기
              </Link>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-[#B89369] text-white font-semibold rounded-lg hover:bg-[#A67F5C] focus:ring-4 focus:ring-[#B89369]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </button>
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              아직 회원이 아니신가요?{" "}
            </span>
            <Link
              to="/users/signup"
              className="text-sm text-[#B89369] hover:text-[#A67F5C] font-semibold transition-colors"
            >
              회원가입
            </Link>
          </div>
        </div>

        {/* 추가 안내 */}
        <div className="text-center text-sm text-gray-500">
          <p>설문 참여하고 포인트를 받아보세요! 💰</p>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
