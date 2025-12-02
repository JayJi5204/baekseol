export type WorkType =
  | "IT"
  | "OFFICE"
  | "MANUFACTURING"
  | "SERVICE"
  | "EDUCATION"
  | "MEDICAL"
  | "CREATIVE"
  | "STUDENT"
  | "SELF_EMPLOYED"
  | "ETC"
  | "";

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  age: number;
  gender: "MALE" | "FEMALE" | "";
  point: number;
  workType: WorkType;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  accessToken: string;
  refreshToken: string;
  role?: "ADMIN" | "USER"; // 관리자 역할 필드 추가(옵션)
  activeToken: string;
}

export interface UserDeleteResponse {
  id: number;
  username: string;
  isDeleted: boolean;
  message: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  password?: string;
  account?: string;
}

export interface UserUpdateResponse {
  username: string;
  email: string;
  age: number;
  gender: "MALE" | "FEMALE" | "";
  account: string;
  point: number;
  role?: "ADMIN" | "USER"; // 관리자 역할 필드 추가(옵션)
}

export interface UserInfoResponse {
  id: number;
  username: string;
  email: string;
  age: number;
  gender: "MALE" | "FEMALE" | "";
  account: string;
  point: number;
  role?: "ADMIN" | "USER"; // 관리자 역할 필드 추가(옵션)
  workType: WorkType;
}

export interface LogoutResponse {
  message: string;
}

export interface FindIdRequest {
  email: string;
}

export interface FindIdResponse {
  maskedUsername: string;
}

export interface SendEmailRequest {
  username: string;
  email: string;
}

export interface SendEmailResponse {
  trueOrFalse: boolean;
  message: string;
}

export interface CheckTokenResponse {
  valid: boolean;
  userId: number | null;
  message: string;
}

export interface FindPasswordRequest {
  token: string;
  newPassword: string;
}

export interface FindPasswordResponse {
  message: string;
}

export interface CheckPasswordRequest {
  password: string;
}

export interface CheckPasswordResponse {
  trueOrFalse: boolean;
  message: string;
}
