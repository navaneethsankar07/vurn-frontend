import api from "@/api/axios";

import type {
    LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SendOTPResponse,
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
