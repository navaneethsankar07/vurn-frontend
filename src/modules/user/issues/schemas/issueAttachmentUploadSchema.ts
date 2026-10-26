import { z } from "zod";

export const issueAttachmentUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 50 * 1024 * 1024,
      "File size must be less than 50MB",
    ),
});

export type IssueAttachmentUploadInput = z.infer<
  typeof issueAttachmentUploadSchema
>;
