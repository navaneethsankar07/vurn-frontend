import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout, updateProfile } from "./accountApi";
import type { GeneralSettingsFormData } from "../types";
import { profileKeys } from "./accountQueries";
import { useDispatch } from "react-redux";
import { updateUser } from "@/modules/public/auth/authSlice";

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
      queryClient.invalidateQueries({ queryKey: profileKeys.all });

      if (responseData?.user) {
        dispatch(updateUser(responseData.user));
      }
    },
  });
}