import { z } from "zod";

export const generalSettingsSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z]+$/, "First name can only contain letters."),

  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z]+$/, "Last name can only contain letters."),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-z0-9_.]+$/,
      "Only lowercase letters, numbers, underscores, and periods are allowed.",
    ),
  avatar: z
    .union([
      z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Image must be 5MB or smaller",
      }),
      z.string(),
      z.null(),
    ])
    .optional(),
});

export type GeneralSettingsSchema = z.infer<typeof generalSettingsSchema>;
