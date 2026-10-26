import { z } from "zod";

export const updateDocumentSchema = z.object({
  folder_id: z.number().optional(),
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title must not exceed 255 characters")
    .optional(),
  content: z.string().trim().min(1, "Content cannot be empty").optional(),
});

export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
