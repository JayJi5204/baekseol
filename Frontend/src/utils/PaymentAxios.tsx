// utils/PaymentAxios.ts
import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

const PAYMENT_API_BASE_URL = import.meta.env.VITE_PAYMENT_API_BASE_URL;

const paymentAxios = axios.create({
    baseURL: PAYMENT_API_BASE_URL,
    withCredentials: true,
});

// 요청 인터셉터: accessToken → Authorization
paymentAxios.interceptors.request.use(
    (config) => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 → 토큰 재발급 로직 (기존 것 복붙/공통함수로 분리)
let isRedirecting = false;

paymentAxios.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) return Promise.reject(error);

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const refreshResponse = await axios.post<{ accessToken: string }>(
                    `${API_BASE_URL}/users/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data.accessToken;
                if (newAccessToken) {
                    sessionStorage.setItem("accessToken", newAccessToken);
                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return paymentAxios(originalRequest);
                }
            } catch (refreshError) {
                if (isRedirecting) {
                    return Promise.reject(refreshError);
                }
                isRedirecting = true;

                sessionStorage.removeItem("accessToken");
                alert("세션이 만료되었습니다.\n다시 로그인해주세요.");
                window.location.href = "/users/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default paymentAxios;
