import api from "@/api/axios";

import type { LogoutResponse, ProfileResponse } from "../types";

export async function logout(): Promise<LogoutResponse> {
  const response = await api.post<LogoutResponse>("/auth/logout/");

  return response.data;
}

export async function getProfile(): Promise<ProfileResponse> {
  const response = await api.get<ProfileResponse>("/profile/");

  return response.data;
}
