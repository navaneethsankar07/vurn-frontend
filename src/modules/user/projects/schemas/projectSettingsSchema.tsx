import { z } from "zod";

export const projectUpdateSchema = z.object({
  name: z.string().min(1, "Project name is required").max(150).optional(),
  key: z.string().min(1, "Project key is required").max(10).optional(),
  description: z.string().optional(),
  status: z.enum(["active", "archived", "completed"]).optional(),
  icon: z.string().optional(),
  accent_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/, "Invalid hex color format")
    .optional(),
  logo: z.instanceof(File).nullable().optional(),
});

export type ProjectUpdateFormData = z.infer<typeof projectUpdateSchema>;
