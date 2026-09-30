import { z } from "zod";

export const createFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Folder name is required")
    .max(150, "Folder name must be 150 characters or less"),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
