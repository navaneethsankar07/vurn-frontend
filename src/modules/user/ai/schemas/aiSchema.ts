import { z } from "zod";

export const aiTaskBreakdownSchema = z.object({
  issue_title: z
    .string()
    .min(1, "Issue title is required.")
    .max(255, "Issue title cannot exceed 255 characters."),
  issue_description: z
    .string()
    .max(10000, "Issue description cannot exceed 10,000 characters.")
    .optional(),
});

export type AiTaskBreakdownFormValues = z.infer<typeof aiTaskBreakdownSchema>;
