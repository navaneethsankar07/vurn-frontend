import api from "@/api/axios";

import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GoogleLoginRequest,
  GoogleLoginResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendOTPResponse,
  User,
  VerifyOTPRequest,
} from "../types";

export const sendOTP = async (
  data: RegisterRequest,
): Promise<SendOTPResponse> => {
  const response = await api.post<SendOTPResponse>("/auth/send-otp/", data);
  return response.data;
};

export const register = async (
  data: VerifyOTPRequest,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/auth/register/", data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login/", data);

  return response.data;
};

export const googleLogin = async (
  data: GoogleLoginRequest,
): Promise<GoogleLoginResponse> => {
  const response = await api.post("/auth/google/", data);

  return response.data;
};

export const forgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>(
    "/auth/forgot-password/",
    data,
  );

  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>(
    "/auth/reset-password/",
    data,
  );

  return response.data;
};

export async function refreshToken(): Promise<RefreshTokenResponse> {
  const response = await api.post<RefreshTokenResponse>("/auth/refresh/");

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>("/auth/me/");  
  
  return response.data;
}
