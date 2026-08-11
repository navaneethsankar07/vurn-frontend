import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  confirmAccountDeletion,
  logout as logoutApi,
  requestAccountDeletion,
  updateProfile,
} from "./accountApi";
import {
  logout as logoutAction,
  updateUser,
} from "@/modules/public/auth/authSlice";
import { accountKeys } from "./accountQueries";
import type { GeneralSettingsFormData } from "../types";
import type { ChangePasswordSchema } from "../schemas/securitySettingsSchema";
import { useAppDispatch } from "@/app/hooks";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
      dispatch(logoutAction());
    },
  });
};

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

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

export function useRequestAccountDeletionMutation() {
  return useMutation({
    mutationFn: (data: { confirmation: string }) =>
      requestAccountDeletion(data),
  });
}

export function useConfirmAccountDeletionMutation() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: { otp: string }) => confirmAccountDeletion(data),
    onSuccess: () => {
      queryClient.clear();
      dispatch(logoutAction());
    },
  });
}
