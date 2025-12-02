import { useEffect, useState } from "react";
import type {
  UserUpdateRequest,
  UserUpdateResponse,
} from "../../types/UserData";
import { useForm } from "react-hook-form";

interface UpdateComponentProps {
  initialData: UserUpdateResponse;
  onSubmit: (
    data: UserUpdateRequest,
    setError: (
      name: keyof UserUpdateRequest,
      error: { type: string; message?: string }
    ) => void
  ) => void;
}

function UpdateComponent({ initialData, onSubmit }: UpdateComponentProps) {
  // ✅ 비밀번호 확인 state 추가
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // ✅ 비밀번호 검증 함수
  const validatePassword = (password: string | undefined): boolean | string => {
    // 비어있으면 검증 안 함 (변경 안 하는 경우)
    if (!password || password.length === 0) return true;

    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return (
      regex.test(password) ||
      "8자 이상, 영문/숫자/특수문자(@$!%*#?&)를 포함해야 합니다."
    );
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<UserUpdateRequest>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      account: "",
    },
  });

  // ✅ 현재 비밀번호 값 감시
  const currentPassword = watch("password");

  useEffect(() => {
    reset({
      username: initialData.username,
      email: initialData.email,
      password: "",
      account: initialData.account,
    });
    // ✅ 초기화 시 비밀번호 확인도 초기화
    setPasswordConfirm("");
  }, [initialData, reset]);

  // ✅ 제출 시 비밀번호 확인 검증 추가
  const handleFormSubmit = (data: UserUpdateRequest) => {
    // 비밀번호를 입력했는데 확인이 일치하지 않으면
    if (data.password && data.password !== passwordConfirm) {
      setError("password", {
        type: "manual",
        message: "비밀번호가 일치하지 않습니다.",
      });
      return;
    }
    onSubmit(data, setError);
  };

  return (
    // ✅ LoginComponent와 동일한 레이아웃 구조
    <div className="min-h-screen bg-[#F3F1E5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 제목 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#B89369] mb-3">
            회원정보 수정
          </h1>
          <p className="text-base text-gray-600">정보를 안전하게 수정하세요</p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#B89369]/20 p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* 닉네임 */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                닉네임
              </label>
              <input
                id="username"
                {...register("username", {
                  required: "닉네임을 입력해주세요.",
                  validate: (value) =>
                    (value?.trim().length ?? 0) > 0 ||
                    "공백만 입력할 수 없습니다.",
                })}
                className="w-full px-4 py-3 border-2 border-[#B89369]/30 rounded-lg focus:ring-2 focus:ring-[#B89369]/30 focus:border-[#B89369] outline-none transition-all"
                placeholder="닉네임을 입력하세요"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* 이메일 */}
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
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                })}
                className="w-full px-4 py-3 border-2 border-[#B89369]/30 rounded-lg focus:ring-2 focus:ring-[#B89369]/30 focus:border-[#B89369] outline-none transition-all"
                placeholder="이메일을 입력하세요"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 비밀번호 */}
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
                {...register("password", {
                  validate: validatePassword,
                })}
                placeholder="변경 시 입력하세요"
                className="w-full px-4 py-3 border-2 border-[#B89369]/30 rounded-lg focus:ring-2 focus:ring-[#B89369]/30 focus:border-[#B89369] outline-none transition-all"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                * 변경하지 않으려면 비워두세요
              </p>
              <p className="text-gray-500 text-xs">
                * 8자 이상, 영문/숫자/특수문자(@$!%*#?&) 포함
              </p>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                비밀번호 확인
              </label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 outline-none transition-all ${
                  passwordConfirm && currentPassword !== passwordConfirm
                    ? "border-red-500 focus:ring-red-400 focus:border-red-500"
                    : "border-[#B89369]/30 focus:ring-[#B89369]/30 focus:border-[#B89369]"
                }`}
              />
              {passwordConfirm && currentPassword !== passwordConfirm && (
                <p className="text-red-500 text-sm mt-1">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              className="w-full py-3 bg-[#B89369] text-white font-semibold rounded-lg hover:bg-[#A67F5C] focus:ring-4 focus:ring-[#B89369]/30 transition-all shadow-sm hover:shadow-md"
            >
              수정하기
            </button>
          </form>
        </div>

        {/* 추가 안내 */}
        <div className="text-center text-sm text-gray-500">
          <p>정보 수정 후 다시 로그인이 필요할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}

export default UpdateComponent;
