import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email("Enter a valid email address."),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(30, "Username cannot exceed 30 characters."),

    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters."),

    last_name: z
      .string()
      .min(1, "Last name is required."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),

    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;