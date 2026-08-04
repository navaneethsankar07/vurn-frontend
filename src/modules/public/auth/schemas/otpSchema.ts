import { z } from "zod";

export const otpSchema = z.object({
  email: z.email(),

  otp: z
    .string()
    .length(6, "OTP must contain exactly 6 digits."),
});

export type OTPFormData = z.infer<typeof otpSchema>;