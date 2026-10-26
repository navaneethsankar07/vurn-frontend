import { z } from "zod";

export const confirmDeleteSchema = z.object({
  code: z
    .string()
    .min(1, "Authorization code is required")
    .trim()
    .regex(/^[a-zA-Z0-9]+$/, "Authorization code must be alphanumeric")
    .length(6, "Authorization code must be exactly 6 characters"),
});

export type ConfirmDeleteFormValues = z.infer<typeof confirmDeleteSchema>;
