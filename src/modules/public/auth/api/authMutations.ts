import { useMutation } from "@tanstack/react-query";

import {
  forgotPassword,
  googleLogin,
  login,
  register,
  resetPassword,
  sendOTP,
} from "./authApi";

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

export const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: googleLogin,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
