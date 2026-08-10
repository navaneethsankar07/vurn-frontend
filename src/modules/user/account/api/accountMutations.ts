import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "./accountApi";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
