import { z } from "zod";

export const generalSettingsSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
});

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;