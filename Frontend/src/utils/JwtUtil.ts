import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const jwtAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ⭐ 리다이렉트 플래그 (파일 최상단에 추가)
let isRedirecting = false;

jwtAxios.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

jwtAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post<{ accessToken: string }>(
          `${API_BASE_URL}/users/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        if (newAccessToken) {
          sessionStorage.setItem("accessToken", newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return jwtAxios(originalRequest);
        }
      } catch (refreshError) {
        if (isRedirecting) {
          return Promise.reject(refreshError);
        }

        isRedirecting = true;

        sessionStorage.removeItem("accessToken");

        if (axios.isAxiosError(refreshError)) {
          const errorMessage = refreshError.response?.data?.error;

          if (errorMessage?.includes("다른 기기")) {
            alert(
              "다른 기기에서 로그인되었습니다.\n보안을 위해 다시 로그인해주세요."
            );
          } else {
            alert("세션이 만료되었습니다.\n다시 로그인해주세요.");
          }
        }

        window.location.href = "/users/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default jwtAxios;
