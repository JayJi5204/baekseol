// types/Payment.ts

export interface PointPackage {
  points: number;
  price: number;
  label: string;
}

// ===================== Enum 타입 (백엔드 동기화) =====================

export const enum TransactionStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

// ✅ 포인트 변동 타입
export type PointType = "GET" | "USE";

// ✅ 참조 타입
export type ReferenceType =
  | "PAYMENT"
  | "WITHDRAWAL"
  | "SURVEY"
  | "REFUND"
  | "ADMIN";

// ===================== Request 타입 =====================

export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentKey: string;
}

export interface WithdrawalRequest {
  amount: number;
  bankCode: string;
  account: string;
  password: string; // ⭐ 추가!
}

// ===================== Response 타입 =====================

// ✅ 결제 응답 (WebFlux PaymentResponseDto 기준)
export interface PaymentResponse {
  paymentId: number;
  userId: number;
  orderId: string;
  orderName: string;
  amount: number;
  method?: string;
  paymentKey?: string;
  status: TransactionStatus;
  approvedAt?: string;
  platformFee?: number; // 재반응시 수수료
  // 결제 영수증 URL (선택)
  receiptUrl?: string;
  // 승인 시각 (yyyy-MM-dd HH:mm:ss 형태의 문자열)
  approvalAt?: string;
  createdAt: string;
}

// ✅ 환급 응답 (WebFlux WithdrawalResponseDto 기준)
export interface WithdrawalResponse {
  withdrawalId: number;
  amount: number;
  bankCode: string;
  // 마스킹된 계좌번호 (예: 1234****90)
  maskedAccount: string;
  status: TransactionStatus;
  // 요청 시각
  requestedAt: string;
  // 완료 시각 (아직 미완료면 없음)
  completedAt?: string;
}

// ✅ 포인트 내역 응답 타입
export interface PointHistoryResponse {
  pointRecordId: number;
  userId: number;
  amount: number;
  type: PointType;
  content: string;
  remainPoint: number;
  referenceType?: ReferenceType; // nullable
  referenceId?: number; // nullable
  platformFee?: number; // 범용 수수료 (포인트 변동시)
  createdAt: string;
}

// ===================== 기타 =====================

export interface Bank {
  code: string;
  name: string;
}


export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

// 기본 수수료 상수 (필요 시 사용)
export const FEE = 300;
