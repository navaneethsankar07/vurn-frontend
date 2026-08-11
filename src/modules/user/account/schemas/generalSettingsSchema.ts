import { z } from "zod";

export const generalSettingsSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  avatar: z
    .union([
      z.instanceof(File).refine((file) => file.size <= 1024 * 1024, {
        message: "Image must be 1MB or smaller",
      }),
      z.string(),
      z.null(),
    ])
    .optional(),
});

export type GeneralSettingsSchema = z.infer<typeof generalSettingsSchema>;
