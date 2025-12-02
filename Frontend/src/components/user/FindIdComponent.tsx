import { useState } from "react";
import { useNavigate } from "react-router";
import { findId } from "../../api/UserApi";
import { AxiosError } from "axios";

function FindIdComponent() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [maskedUsername, setMaskedUsername] = useState<string>("");
  const [isFound, setIsFound] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsFound(false);

    try {
      const response = await findId({ email });
      setMaskedUsername(response.maskedUsername);
      setIsFound(true);
    } catch (err) {
      console.error("아이디 찾기 실패:", err);

      if (err instanceof AxiosError) {
        const message =
          err.response?.data?.message || "아이디 찾기에 실패했습니다.";
        setError(message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F1E5] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* 제목 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#B89369] mb-3">
            아이디 찾기
          </h1>
          <p className="text-base text-gray-600">
            가입 시 등록한 이메일을 입력해주세요
          </p>
        </div>

        {/* 카드 */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#B89369]/20 p-8">
          {!isFound ? (
            // 이메일 입력 폼
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 에러 메시지 */}
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* 이메일 입력 */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#B89369]/30 rounded-lg focus:ring-2 focus:ring-[#B89369]/30 focus:border-[#B89369] outline-none transition-all"
                  placeholder="example@email.com"
                />
              </div>

              {/* 아이디 찾기 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#B89369] text-white font-semibold rounded-lg hover:bg-[#A67F5C] focus:ring-4 focus:ring-[#B89369]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    찾는 중...
                  </span>
                ) : (
                  "아이디 찾기"
                )}
              </button>

              {/* 뒤로가기 버튼 */}
              <button
                type="button"
                onClick={() => navigate("/users/login")}
                className="w-full py-3 text-gray-600 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-all"
              >
                로그인으로 돌아가기
              </button>
            </form>
          ) : (
            // 결과 표시
            <div className="space-y-6">
              {/* 성공 아이콘 */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">✓</span>
                </div>
              </div>

              {/* 결과 메시지 */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  아이디를 찾았습니다
                </h3>
                <p className="text-gray-600 text-sm mb-4">회원님의 아이디는</p>
                <div className="bg-[#F3F1E5] py-4 px-6 rounded-lg">
                  <p className="text-2xl font-bold text-[#B89369]">
                    {maskedUsername}
                  </p>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/users/login")}
                  className="w-full py-3 bg-[#B89369] text-white font-semibold rounded-lg hover:bg-[#A67F5C] transition-all shadow-sm hover:shadow-md"
                >
                  로그인하러 가기
                </button>

                <button
                  onClick={() => navigate("/users/sendemail")}
                  className="w-full py-3 text-[#B89369] font-semibold rounded-lg border-2 border-[#B89369] hover:bg-[#F9F6F1] transition-all"
                >
                  비밀번호 찾기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 추가 안내 */}
        {!isFound && (
          <div className="text-center text-sm text-gray-500">
            <p>
              비밀번호도 잊으셨나요?{" "}
              <button
                onClick={() => navigate("/users/sendemail")}
                className="text-[#B89369] hover:text-[#A67F5C] font-semibold transition-colors"
              >
                비밀번호 찾기
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindIdComponent;
