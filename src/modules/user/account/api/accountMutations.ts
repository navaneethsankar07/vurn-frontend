import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { changePassword, logout, updateProfile } from "./accountApi";
import { accountKeys } from "./accountQueries";
import { updateUser } from "@/modules/public/auth/authSlice";
import type { GeneralSettingsFormData } from "../types";
import type { ChangePasswordSchema } from "../schemas/securitySettingsSchema";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data: Omit<GeneralSettingsFormData, "email">) =>
      updateProfile(data),
    onSuccess: (responseData) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.profile });

      if (responseData?.user) {
        dispatch(updateUser(responseData.user));
      }
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (data: ChangePasswordSchema) => changePassword(data),
  });
}
