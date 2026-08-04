import { useMutation } from "@tanstack/react-query";

import { register, sendOTP } from "./authApi";

// Send OTP Mutation
export const useSendOTPMutation = () => {
  return useMutation({
    mutationFn: sendOTP,
  });
};

// Register Mutation
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: register,
  });
};