import type {
  CheckPasswordRequest,
  CheckPasswordResponse,
  CheckTokenResponse,
  FindIdRequest,
  FindIdResponse,
  FindPasswordRequest,
  FindPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SendEmailRequest,
  SendEmailResponse,
  SignupRequest,
  UserDeleteResponse,
  UserInfoResponse,
  UserUpdateRequest,
  UserUpdateResponse,
} from "../types/UserData";
import jwtAxios from "../utils/JwtUtil";

export const signup = async (signupData: SignupRequest) => {
  const res = await jwtAxios.post(`/users/signup`, signupData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const login = async (
  loginData: LoginRequest
): Promise<LoginResponse> => {
  const res = await jwtAxios.post<LoginResponse>(`/users/login`, loginData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return res.data;
};

export const logout = async (): Promise<LogoutResponse> => {
  const res = await jwtAxios.post<LogoutResponse>(
    `/users/logout`,
    {},
    { withCredentials: true }
  );
  return res.data;
};

export const userInfo = async (): Promise<UserInfoResponse> => {
  const res = await jwtAxios.get<UserInfoResponse>(`/users/userinfo`);
  return res.data;
};

export const deleteUser = async (): Promise<UserDeleteResponse> => {
  const res = await jwtAxios.delete<UserDeleteResponse>(`/users/delete`);
  return res.data;
};

export const updateUser = async (
  data: UserUpdateRequest
): Promise<UserUpdateResponse> => {
  const res = await jwtAxios.put<UserUpdateResponse>(`/users/update`, data);
  return res.data;
};

export const findId = async (data: FindIdRequest): Promise<FindIdResponse> => {
  const res = await jwtAxios.post<FindIdResponse>("users/find/id", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const sendEmail = async (
  data: SendEmailRequest
): Promise<SendEmailResponse> => {
  const res = await jwtAxios.post<SendEmailResponse>(
    "users/find/sendMail",
    data,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

export const findPassword = async (
  data: FindPasswordRequest
): Promise<FindPasswordResponse> => {
  const res = await jwtAxios.post<FindPasswordResponse>(
    "users/find/password",
    data,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

export const verifyResetToken = async (
  token: string
): Promise<CheckTokenResponse> => {
  const res = await jwtAxios.get<CheckTokenResponse>(`users/find/checkToken`, {
    params: { token },
  });
  return res.data;
};

export const checkPassword = async (
  password: CheckPasswordRequest
): Promise<CheckPasswordResponse> => {
  const res = await jwtAxios.post<CheckPasswordResponse>(
    `/users/check/password`,
    password,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return res.data;
};
