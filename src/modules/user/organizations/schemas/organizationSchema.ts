import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .max(50, "Name must be less than 50 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  description: z
    .string()
    .max(250, "Description must be less than 250 characters")
    .optional(),
  icon: z.string().optional(),
  accent_color: z.string().optional(),
});

export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;
