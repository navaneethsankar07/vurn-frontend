import api from "@/api/axios";

import type {
    RegisterRequest,
    RegisterResponse,
    SendOTPResponse,
    VerifyOTPRequest,
} from "../types";

export const sendOTP = async (data: RegisterRequest): Promise<SendOTPResponse> => {
    const response = await api.post<SendOTPResponse>("/auth/send-otp/", data);
    return response.data;
}

export const register = async (data: VerifyOTPRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register/", data);
    return response.data;
}