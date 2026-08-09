import api from "@/api/axios";

import type { LogoutResponse } from "../types";

export async function logout(): Promise<LogoutResponse> {
  const response = await api.post<LogoutResponse>("/auth/logout/");

  return response.data;
}