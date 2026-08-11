import api from "@/api/axios";

import type {
  GeneralSettingsFormData,
  LogoutResponse,
  ProfileResponse,
} from "../types";
import type { ChangePasswordSchema } from "../schemas/securitySettingsSchema";

export async function logout(): Promise<LogoutResponse> {
  const response = await api.post<LogoutResponse>("/auth/logout/");

  return response.data;
}

export async function getProfile(): Promise<ProfileResponse> {
  const response = await api.get<ProfileResponse>("/profile/");

  return response.data;
}

export async function updateProfile(
  data: Omit<GeneralSettingsFormData, "email">,
): Promise<ProfileResponse> {
  const formData = new FormData();
  formData.append("first_name", data.first_name);
  formData.append("last_name", data.last_name);
  formData.append("username", data.username);

  if (data.avatar instanceof File) {
    formData.append("avatar", data.avatar);
  }

  const response = await api.patch<ProfileResponse>("/profile/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function changePassword(
  data: ChangePasswordSchema,
): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(
    "/profile/change-password/",
    {
      current_password: data.current_password,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    },
  );

  return response.data;
}
