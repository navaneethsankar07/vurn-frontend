import { z } from "zod";

export const createDocumentSchema = z.object({
  folder_id: z.number({ message: "Folder is required" }),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters"),
  content: z.string().trim().min(1, "Content cannot be empty"),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
