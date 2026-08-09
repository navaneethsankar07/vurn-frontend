import { useMutation } from "@tanstack/react-query";

import { logout } from "./accountApi";

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logout,
  });
};