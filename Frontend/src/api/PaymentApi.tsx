// api/PaymentApi.tsx
import jwtAxios from "../utils/JwtUtil";
import type {
  PaymentResponse,
  WithdrawalResponse,
  PointHistoryResponse, // ✅ types/Payment.ts에서 import
  ApiResponse,
} from "../types/Payment";

// ===================== 결제 관련 =====================

/**
 * 결제 요청
 */
export async function confirmPayment(data: {
  orderId: string;
  orderName: string;
  amount: number;
  paymentKey: string;
}): Promise<PaymentResponse> {
  const response = await jwtAxios.post<ApiResponse<PaymentResponse>>(
    "/payments/pay",
    data
  );
  return response.data.data;
}

/**
 * 결제 상세 조회 (본인 확인)
 */
export async function getPaymentDetail(
  paymentId: number
): Promise<PaymentResponse> {
  const response = await jwtAxios.get<ApiResponse<PaymentResponse>>(
    `/payments/pay/${paymentId}`
  );
  return response.data.data;
}

/**
 * 결제 내역 목록 (본인)
 */
export async function getPaymentList(): Promise<PaymentResponse[]> {
  const response = await jwtAxios.get<ApiResponse<PaymentResponse[]>>(
    "/payments/pay/user"
  );
  return response.data.data;
}

// ===================== 환급 관련 =====================

/**
 * 환급 요청
 */
export async function requestWithdrawal(data: {
  amount: number;
  bankCode: string;
  account: string;
}): Promise<WithdrawalResponse> {
  const response = await jwtAxios.post<ApiResponse<WithdrawalResponse>>(
    "/payments/withdrawal",
    data
  );
  return response.data.data;
}

/**
 * 환급 상세 조회 (본인 확인)
 */
export async function getWithdrawalDetail(
  withdrawalId: number
): Promise<WithdrawalResponse> {
  const response = await jwtAxios.get<ApiResponse<WithdrawalResponse>>(
    `/payments/withdrawal/${withdrawalId}`
  );
  return response.data.data;
}

/**
 * 환급 내역 목록 (본인)
 */
export async function getWithdrawalHistory(): Promise<WithdrawalResponse[]> {
  const response = await jwtAxios.get<ApiResponse<WithdrawalResponse[]>>(
    "/payments/withdrawal/user"
  );
  return response.data.data;
}

// ===================== 포인트 관련 =====================

/**
 * 포인트 내역 조회
 */
export async function getPointHistory(): Promise<PointHistoryResponse[]> {
  const response = await jwtAxios.get<ApiResponse<PointHistoryResponse[]>>(
    "/points/history"
  );
  return response.data.data;
}

/**
 * 현재 포인트 조회
 */
export async function getPointBalance(): Promise<number> {
  const response = await jwtAxios.get<ApiResponse<number>>("/points/balance");
  return response.data.data;
}

// ===================== 타입 Re-export =====================
export type {
  PaymentResponse,
  WithdrawalResponse,
  PointHistoryResponse, // ✅ 추가
};
