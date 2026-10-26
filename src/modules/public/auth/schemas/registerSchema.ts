import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email("Enter a valid email address."),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(15, "Username cannot exceed 15 characters.")
      .regex(
        /^[a-z0-9_.]+$/,
        "Only lowercase letters, numbers, underscores, and periods are allowed.",
      ),

    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters.")
      .regex(/^[a-zA-Z]+$/, "First name can only contain letters."),

    last_name: z
      .string()
      .min(1, "Last name is required.")
      .regex(/^[a-zA-Z]+$/, "Last name can only contain letters."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .max(128, "Password cannot exceed 128 characters."),

    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
