import { z } from "zod";

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(50, "Tag name cannot exceed 50 characters"),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
