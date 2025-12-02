// zstore/useZustandUser.ts
import { create } from "zustand";
import { AxiosError } from "axios";
import { login, logout, userInfo } from "../api/UserApi";
import type {
  LoginRequest,
  LoginResponse,
  UserInfoResponse,
} from "../types/UserData";

export interface AuthInfo {
  id: number;
  username: string;
  accessToken: string;
  points: number;
  role?: "ADMIN" | "USER"; // 역할 필드 추가
}

interface ErrorResponse {
  field?: "username" | "password";
  message?: string;
}

export interface UserStore {
  user: AuthInfo;
  status: "" | "success" | "fail" | "loading";
  error: string;
  errorField: "username" | "password" | "";
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  save: (userInfo: AuthInfo) => void;
  loadUserInfo: () => Promise<void>;
  updateUserInfo: (updates: Partial<AuthInfo>) => void;
  refetchUser: () => Promise<void>;
}

const initState: AuthInfo = {
  id: 0,
  username: "",
  accessToken: "",
  points: 0,
  role: "USER", // 기본 역할
};

const useZustandUser = create<UserStore>((set) => ({
  user: initState,
  status: "",
  error: "",
  errorField: "",

  login: async (username: string, password: string) => {
    set({ status: "loading", error: "", errorField: "" });
    const loginData: LoginRequest = { username, password };

    try {
      const res: LoginResponse = await login(loginData);

      const authInfo: AuthInfo = {
        id: res.id,
        username: res.username,
        accessToken: res.accessToken,
        points: 0,
        role: res.role ?? "USER", // 로그인 응답에 role 포함 필요
      };

      sessionStorage.setItem("accessToken", authInfo.accessToken);
      set({ user: authInfo, status: "success", error: "", errorField: "" });
    } catch (error) {
      let errorMessage =
        "로그인에 실패했습니다. 닉네임과 비밀번호를 확인해주세요.";
      let errorField: "username" | "password" | "" = "";

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as ErrorResponse;
        if (data.field && data.message) {
          errorMessage = data.message;
          errorField = data.field;
        }
      }

      set({ status: "fail", error: errorMessage, errorField });
    }
  },

  logout: async () => {
    try {
      await logout();
    } catch (err) {
      console.error("서버 로그아웃 실패:", err);
    }
    sessionStorage.removeItem("accessToken");
    set({ user: { ...initState }, status: "" });
  },

  save: (userInfo: AuthInfo) => {
    sessionStorage.setItem("accessToken", userInfo.accessToken);
    set({ user: userInfo, status: "success" });
  },

  loadUserInfo: async () => {
    set({ status: "loading" });

    try {
      const userData: UserInfoResponse = await userInfo();
      const token = sessionStorage.getItem("accessToken") ?? "";

      const authInfo: AuthInfo = {
        id: userData.id,
        username: userData.username,
        accessToken: token,
        points: userData.point,
        role: userData.role ?? "USER",
      };

      set({ user: authInfo, status: "success" });
    } catch (error) {
      console.error(error);
      sessionStorage.removeItem("accessToken");
      set({ user: { ...initState }, status: "fail" });
    }
  },
  updateUserInfo: (updates) => {
    set((state) => ({
      user: { ...state.user, ...updates },
    }));
  },

  refetchUser: async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) return;

    try {
      const userData: UserInfoResponse = await userInfo();
      set((state) => ({
        user: {
          ...state.user,
          points: userData.point,
          role: userData.role ?? "USER", // 갱신 시 역할도 반영
        },
      }));
    } catch (error) {
      console.error("사용자 정보 갱신 실패:", error);
    }
  },
}));

export default useZustandUser;
