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
import type { GeneralSettingsFormData, ProfileResponse } from "../types";
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

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: accountKeys.profileDetail() });

      const previousProfile = queryClient.getQueryData<ProfileResponse>(
        accountKeys.profileDetail()
      );

      if (previousProfile?.user) {
        const updatedFullName =
          `${newData.first_name} ${newData.last_name}`.trim();

        const optimisticUser = {
          ...previousProfile.user,
          full_name: updatedFullName,
          username: newData.username,
          avatar:
            newData.avatar instanceof File
              ? URL.createObjectURL(newData.avatar)
              : newData.avatar,
        };

        queryClient.setQueryData<ProfileResponse>(accountKeys.profileDetail(), {
          ...previousProfile,
          user: optimisticUser,
        });

        dispatch(updateUser(optimisticUser));
      }

      return { previousProfile };
    },

    onError: (_err, _newData, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(
          accountKeys.profileDetail(),
          context.previousProfile
        );
        if (context.previousProfile.user) {
          dispatch(updateUser(context.previousProfile.user));
        }
      }
    },

    onSuccess: (responseData) => {
      if (responseData?.user) {
        dispatch(updateUser(responseData.user));
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.profileDetail() });
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
