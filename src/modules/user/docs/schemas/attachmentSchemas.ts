import { z } from "zod";

export const initAttachmentUploadSchema = z.object({
  file_name: z.string().min(1, "File name is required"),
  file_size: z.number().positive("File size must be positive"),
  mime_type: z.string().min(1, "MIME type is required"),
});

export const completeAttachmentUploadSchema = z.object({
  object_key: z.string().min(1, "Object key is required"),
});

export type InitAttachmentUploadInput = z.infer<
  typeof initAttachmentUploadSchema
>;
export type CompleteAttachmentUploadInput = z.infer<
  typeof completeAttachmentUploadSchema
>;
