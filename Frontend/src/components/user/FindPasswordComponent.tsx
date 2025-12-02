import { useState, useEffect } from "react";
import { findPassword, verifyResetToken } from "../../api/UserApi";
import { useNavigate, useSearchParams } from "react-router";
import { AxiosError } from "axios";

function FindPasswordComponent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  // ✅ 비밀번호 검증 함수 추가
  const validatePassword = (password: string): boolean => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  // 페이지 로드 시 토큰 검증
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        setIsTokenValid(false);
        return;
      }

      try {
        const response = await verifyResetToken(token);

        if (response.valid) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          setMessage(response.message);
        }
      } catch (error) {
        setIsTokenValid(false);
        if (error instanceof AxiosError) {
          setMessage(
            error.response?.data?.message || "토큰 검증에 실패했습니다."
          );
        } else {
          setMessage("토큰 검증에 실패했습니다.");
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("유효하지 않은 접근입니다.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    // ✅ 비밀번호 정책 검증 (4자 → 8자 + 정책)
    if (!validatePassword(newPassword)) {
      setMessage(
        "비밀번호는 8자 이상, 영문/숫자/특수문자(@$!%*#?&)를 포함해야 합니다."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await findPassword({ token, newPassword });
      setMessage(response.message);
      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;

        if (
          errorMessage?.includes("만료") ||
          errorMessage?.includes("유효하지 않은")
        ) {
          setMessage("이 링크는 이미 사용되었거나 만료되었습니다.");
          setTimeout(() => navigate("/users/sendemail"), 5000);
        } else {
          setMessage(errorMessage || "비밀번호 변경에 실패했습니다.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // 토큰 검증 중
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#F3F1E5] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-[#B89369]/20 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#B89369]"></div>
            </div>
            <p className="text-gray-600">링크 확인 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 토큰 없음 또는 유효하지 않음
  if (!token || !isTokenValid) {
    return (
      <div className="min-h-screen bg-[#F3F1E5] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-[#B89369]/20 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {message || "유효하지 않은 링크"}
            </h2>
            <p className="text-gray-600 mb-6">
              비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다.
            </p>
            <button
              onClick={() => navigate("/users/sendemail")}
              className="w-full py-3 bg-[#B89369] text-white font-semibold rounded-lg hover:bg-[#A67F5C] transition-all shadow-sm hover:shadow-md"
            >
              비밀번호 찾기로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F1E5] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* 제목 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#B89369] mb-3">
            비밀번호 재설정
          </h1>
          <p className="text-base text-gray-600">
            새로운 비밀번호를 입력해주세요
          </p>
        </div>

        {/* 카드 */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#B89369]/20 p-8">
          {!isSuccess ? (
            // 입력 폼
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 에러 메시지 */}
              {message && !isSuccess && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <span className="text-sm">{message}</span>
                </div>
              )}

              {/* 새 비밀번호 입력 */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  새 비밀번호
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="8자 이상, 영문/숫자/특수문자 포함"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#B89369]/30 outline-none transition-all ${
                    newPassword.length > 0 && !validatePassword(newPassword)
                      ? "border-red-500 focus:border-red-600"
                      : "border-[#B89369]/30 focus:border-[#B89369]"
                  }`}
                />
                {/* ✅ 실시간 검증 메시지 */}
                {newPassword.length > 0 && !validatePassword(newPassword) && (
                  <p className="text-red-500 text-sm mt-1">
                    8자 이상, 영문/숫자/특수문자(@$!%*#?&)를 포함해야 합니다.
                  </p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="비밀번호를 다시 입력하세요"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#B89369]/30 outline-none transition-all ${
                    confirmPassword && newPassword !== confirmPassword
                      ? "border-red-400 focus:border-red-500"
                      : "border-[#B89369]/30 focus:border-[#B89369]"
                  }`}
                />
                {/* ✅ 실시간 일치 여부 표시 */}
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </div>

              {/* ✅ 비밀번호 안내 업데이트 */}
              <div className="bg-[#F3F1E5] p-4 rounded-lg">
                <p className="text-xs text-gray-600">
                  ✓ 8자 이상 입력해주세요
                  <br />✓ 영문, 숫자, 특수문자(@$!%*#?&)를 포함해야 합니다
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
                    변경 중...
                  </span>
                ) : (
                  "비밀번호 변경"
                )}
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
                  비밀번호가 변경되었습니다
                </h3>
                <p className="text-gray-600 text-sm mb-4">{message}</p>
                <div className="bg-[#F3F1E5] py-4 px-6 rounded-lg">
                  <p className="text-sm text-gray-700">
                    🔒 새로운 비밀번호로 로그인해주세요
                  </p>
                </div>
              </div>

              {/* 로그인 이동 버튼 */}
              <button
                onClick={() => navigate("/users/login")}
                className="w-full py-3 bg-[#B89369] text-white font-semibold rounded-lg hover:bg-[#A67F5C] transition-all shadow-sm hover:shadow-md"
              >
                로그인하러 가기
              </button>
            </div>
          )}
        </div>

        {/* 추가 안내 */}
        {!isSuccess && (
          <div className="text-center text-sm text-gray-500">
            <p>
              이미 계정이 있으신가요?{" "}
              <button
                onClick={() => navigate("/users/login")}
                className="text-[#B89369] hover:text-[#A67F5C] font-semibold transition-colors"
              >
                로그인
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindPasswordComponent;
