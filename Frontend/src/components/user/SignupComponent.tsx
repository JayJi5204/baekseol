import { useState } from "react";
import { useNavigate } from "react-router";
import { signup } from "../../api/UserApi";
import { AxiosError } from "axios";
import type { SignupRequest } from "../../types/UserData";

function SignupComponent() {
  const navigate = useNavigate();

  // 비밀번호 검증 함수 추가 ✅
  const validatePassword = (password: string): boolean => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  const [formData, setFormData] = useState<SignupRequest>({
    username: "",
    email: "",
    password: "",
    age: 0,
    gender: "",
    point: 0,
    workType: "",
  });

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldError, setFieldError] = useState<"username" | "email" | "">("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldError("");

    // 아이디 길이 검증 추가 ✅
    if (formData.username.length < 4) {
      setError("아이디는 최소 4자리 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    // 비밀번호 확인 검증
    if (formData.password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    // 비밀번호 정책 검증 ✅ (수정)
    if (!validatePassword(formData.password)) {
      setError(
        "비밀번호는 8자 이상, 영문/숫자/특수문자(@$!%*#?&)를 포함해야 합니다."
      );
      setLoading(false);
      return;
    }

    try {
      const result = await signup(formData);
      console.log("회원가입 성공:", result);
      alert("회원가입이 완료되었습니다!");
      navigate("/users/login");
    } catch (err) {
      console.error("회원가입 실패:", err);

      if (err instanceof AxiosError) {
        const message =
          err.response?.data?.message || "회원가입에 실패했습니다.";
        const field = err.response?.data?.fieldName as
          | "username"
          | "email"
          | undefined;

        setError(message);
        if (field === "username" || field === "email") {
          setFieldError(field);
        }
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-5">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-3xl font-semibold text-[#B89369] text-center mb-8">
          회원가입
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 아이디 - 4글자 이상 검증 추가 ✅ */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              아이디 <span className="text-[#B89369]">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="아이디를 입력하세요 (4자리 이상)"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                fieldError === "username"
                  ? "border-red-500 focus:border-red-600"
                  : formData.username.length > 0 && formData.username.length < 4
                  ? "border-red-500 focus:border-red-600"
                  : "border-[#F3F1E5] focus:border-[#B89369]"
              }`}
            />
            {fieldError === "username" && (
              <p className="text-red-500 text-sm mt-1">
                이미 존재하는 닉네임입니다.
              </p>
            )}
            {formData.username.length > 0 &&
              formData.username.length < 4 &&
              !fieldError && (
                <p className="text-red-500 text-sm mt-1">
                  닉네임은 최소 4자리 이상이어야 합니다.
                </p>
              )}
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              이메일 <span className="text-[#B89369]">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                fieldError === "email"
                  ? "border-red-500 focus:border-red-600"
                  : "border-[#F3F1E5] focus:border-[#B89369]"
              }`}
            />
            {fieldError === "email" && (
              <p className="text-red-500 text-sm mt-1">
                이미 등록된 이메일입니다.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              비밀번호 <span className="text-[#B89369]">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="8자 이상, 영문/숫자/특수문자 포함"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                formData.password.length > 0 &&
                !validatePassword(formData.password)
                  ? "border-red-500 focus:border-red-600"
                  : "border-[#F3F1E5] focus:border-[#B89369]"
              }`}
            />
            {/* 실시간 검증 메시지 ✅ */}
            {formData.password.length > 0 &&
              !validatePassword(formData.password) && (
                <p className="text-red-500 text-sm mt-1">
                  8자 이상, 영문/숫자/특수문자(@$!%*#?&)를 포함해야 합니다.
                </p>
              )}
            {/* 안내 문구 추가 ✅ */}
            <p className="text-gray-500 text-xs mt-1">
              * 사용 가능한 특수문자: @ $ ! % * # ? &
            </p>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              비밀번호 확인 <span className="text-[#B89369]">*</span>
            </label>
            <input
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              placeholder="비밀번호를 다시 입력하세요"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                passwordConfirm && formData.password !== passwordConfirm
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#F3F1E5] focus:border-[#B89369]"
              }`}
            />
            {passwordConfirm && formData.password !== passwordConfirm && (
              <p className="text-red-500 text-sm mt-1">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* 나이 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              나이 <span className="text-[#B89369]">*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
              required
              min="1"
              placeholder="나이를 입력하세요"
              className="w-full px-4 py-3 border-2 border-[#F3F1E5] rounded-lg focus:outline-none focus:border-[#B89369] transition-colors"
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              성별 <span className="text-[#B89369]">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-[#F3F1E5] rounded-lg focus:outline-none focus:border-[#B89369] transition-colors bg-white cursor-pointer"
            >
              <option value="">선택하세요</option>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              직업 분야 <span className="text-[#B89369]">*</span>
            </label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-[#F3F1E5] rounded-lg focus:outline-none focus:border-[#B89369] transition-colors bg-white cursor-pointer"
            >
              <option value="">선택하세요</option>
              <option value="IT">IT/개발</option>
              <option value="OFFICE">사무/관리직</option>
              <option value="MANUFACTURING">제조/건설</option>
              <option value="SERVICE">서비스/판매</option>
              <option value="EDUCATION">교육</option>
              <option value="MEDICAL">의료</option>
              <option value="CREATIVE">창작/디자인/미디어</option>
              <option value="STUDENT">학생</option>
              <option value="SELF_EMPLOYED">프리랜서/자영업</option>
              <option value="ETC">기타</option>
            </select>
          </div>

          {/* 공통 에러 */}
          {error && !fieldError && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-colors ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#B89369] hover:bg-[#A67F5C]"
            }`}
          >
            {loading ? "처리 중..." : "회원가입"}
          </button>

          {/* 🔙 뒤로가기 버튼 */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-lg text-[#B89369] font-semibold text-lg border-2 border-[#B89369] hover:bg-[#F9F6F1] transition-colors mt-2"
          >
            뒤로가기
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupComponent;
