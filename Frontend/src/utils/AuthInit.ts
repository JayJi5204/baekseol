import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const initializeAuth = async () => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken) return;

  // accessToken이 없다면 refresh 시도
  try {
    const response = await axios.post<{ accessToken: string }>(
      `${API_BASE_URL}/users/refresh`,
      {},
      { withCredentials: true }
    );

    const newAccessToken = response.data.accessToken;
    sessionStorage.setItem("accessToken", newAccessToken);
    console.log("✅ 자동 로그인 성공");
  } catch (error) {
    console.log("🔴 자동 로그인 실패");
    console.log(error);
  }
};
