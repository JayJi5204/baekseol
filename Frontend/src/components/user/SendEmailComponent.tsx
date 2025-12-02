import { useState } from "react";
import { useNavigate } from "react-router";
import { sendEmail } from "../../api/UserApi";
import { AxiosError } from "axios";

function SendEmailComponent() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email) {
      setMessage("아이디와 이메일을 모두 입력해주세요.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await sendEmail({ username, email });

      if (response.trueOrFalse) {
        setMessage(response.message);
        setIsSuccess(true);
      } else {
        setMessage(response.message);
        setIsSuccess(false);
      }
    } catch (error) {
      setIsSuccess(false);
      if (error instanceof AxiosError) {
        setMessage(
          error.response?.data?.message || "이메일 발송에 실패했습니다."
        );
      } else {
        setMessage("알 수 없는 오류가 발생했습니다.");
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
            비밀번호 찾기
          </h1>
          <p className="text-base text-gray-600">
            가입 시 등록한 정보를 입력해주세요
          </p>
        </div>

        {/* 카드 */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#B89369]/20 p-8">
          {!isSuccess ? (
            // 입력 폼
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 에러 메시지 */}
              {message && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <span className="text-sm whitespace-pre-line">{message}</span>
                </div>
              )}

              {/* 아이디 입력 */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  아이디
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#B89369]/30 rounded-lg focus:ring-2 focus:ring-[#B89369]/30 focus:border-[#B89369] outline-none transition-all"
                  placeholder="아이디를 입력하세요"
                />
              </div>

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

              {/* 안내 메시지 */}
              <div className="bg-[#F3F1E5] p-4 rounded-lg">
                <p className="text-xs text-gray-600">
                  ⚠️ 비밀번호 찾기는 1시간에 3번까지만 시도할 수 있습니다.
                </p>
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#B89369] text-white font-semibold rounded-lg hover:bg-[#A67F5C] focus:ring-4 focus:ring-[#B89369]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    발송 중...
                  </span>
                ) : (
                  "비밀번호 재설정 메일 발송"
                )}
              </button>

              {/* ✅ 뒤로가기 버튼 - loading 상태일 때 비활성화 */}
              <button
                type="button"
                onClick={() => navigate("/users/login")}
                disabled={loading}
                className="w-full py-3 text-gray-600 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                로그인으로 돌아가기
              </button>
            </form>
          ) : (
            // 성공 메시지
            <div className="space-y-6">
              {/* 성공 아이콘 */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">✓</span>
                </div>
              </div>

              {/* 성공 메시지 */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  메일이 발송되었습니다
                </h3>
                <p className="text-gray-600 text-sm mb-4 whitespace-pre-line">
                  {message}
                </p>
                <div className="bg-[#F3F1E5] py-4 px-6 rounded-lg">
                  <p className="text-sm text-gray-700">
                    📧 이메일을 확인하고 비밀번호 재설정 링크를 클릭해주세요.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    ※ 링크는 30분 동안 유효합니다.
                  </p>
                </div>
              </div>

              {/* 액션 버튼 */}
              <button
                onClick={() => navigate("/users/login")}
                className="w-full py-3 bg-[#B89369] text-white font-semibold rounded-lg hover:bg-[#A67F5C] transition-all shadow-sm hover:shadow-md"
              >
                로그인으로 돌아가기
              </button>
            </div>
          )}
        </div>

        {/* 추가 안내 */}
        {!isSuccess && (
          <div className="text-center text-sm text-gray-500">
            <p>
              아이디가 기억나지 않으시나요?{" "}
              <button
                onClick={() => navigate("/users/findid")}
                className="text-[#B89369] hover:text-[#A67F5C] font-semibold transition-colors"
              >
                아이디 찾기
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SendEmailComponent;
