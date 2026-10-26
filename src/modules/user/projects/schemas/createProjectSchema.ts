import { z } from "zod";

export const createProjectSchema = z
  .object({
    name: z.string().min(1, "Project name is required"),
    key: z
      .string()
      .min(1, "Project key is required")
      .max(10, "Key cannot exceed 10 characters")
      .regex(/^[A-Z][A-Z0-9]*$/, {
        message: "Key must start with an uppercase letter and contain only uppercase letters and numbers",
      }),
    description: z.string().optional(),
    icon: z.string().optional(),
    accent_color: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        message: "Invalid hex color format",
      })
      .optional(),
    start_date: z.string().optional(),
    target_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.target_date) {
        return new Date(data.target_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "Target date cannot be before start date",
      path: ["target_date"],
    }
  );

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;