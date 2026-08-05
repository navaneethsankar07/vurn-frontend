import { useMutation } from "@tanstack/react-query";

import { login, register, sendOTP } from "./authApi";

export const useSendOTPMutation = () => {
  return useMutation({
    mutationFn: sendOTP,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
  });
};
