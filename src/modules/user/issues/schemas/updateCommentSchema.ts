import { z } from "zod";

export const updateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment content cannot be empty.")
    .max(5000, "Comment cannot exceed 5000 characters."),
});

export type UpdateCommentFormValues = z.infer<typeof updateCommentSchema>;
