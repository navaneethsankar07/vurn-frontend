import { z } from "zod";
import { DANGER_ZONE_CONSTANTS } from "../constants";

export const deleteAccountRequestSchema = z.object({
  confirmation: z
    .string()
    .min(1, "Confirmation text is required")
    .refine(
      (val): val is typeof DANGER_ZONE_CONSTANTS.CONFIRMATION_PHRASE =>
        val === DANGER_ZONE_CONSTANTS.CONFIRMATION_PHRASE,
      {
        message: `You must type "${DANGER_ZONE_CONSTANTS.CONFIRMATION_PHRASE}" exactly`,
      },
    ),
});

export const deleteAccountConfirmSchema = z.object({
  otp: z
    .string()
    .length(
      DANGER_ZONE_CONSTANTS.OTP_LENGTH,
      `OTP must be exactly ${DANGER_ZONE_CONSTANTS.OTP_LENGTH} digits`,
    )
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type DeleteAccountRequestSchema = z.input<
  typeof deleteAccountRequestSchema
>;
export type DeleteAccountConfirmSchema = z.input<
  typeof deleteAccountConfirmSchema
>;
