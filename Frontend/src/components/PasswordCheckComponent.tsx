import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkPassword } from "../api/UserApi";

function PasswordCheckComponent() {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const nextUrl = searchParams.get("next") ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await checkPassword({ password });

      if (res.trueOrFalse === true) {
        navigate(nextUrl);
      } else {
        setErrorMsg("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      setErrorMsg("서버 오류가 발생했습니다.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F1E5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-[#B89369]">
          비밀번호 확인
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-[#B89369]/20 p-8 space-y-6"
        >
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#B89369] outline-none transition-all border-[#B89369]/30 focus:border-[#B89369]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#B89369] text-white font-semibold rounded-lg hover:bg-[#A67F5C] focus:ring-4 focus:ring-[#B89369]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                검증중...
              </span>
            ) : (
              "확인"
            )}
          </button>

          {/* 뒤로가기 버튼 */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-lg text-[#B89369] font-semibold text-lg border-2 border-[#B89369] hover:bg-[#F9F6F1] transition-colors"
          >
            뒤로가기
          </button>

          {errorMsg && (
            <p className="text-red-500 text-center mt-2">{errorMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default PasswordCheckComponent;
