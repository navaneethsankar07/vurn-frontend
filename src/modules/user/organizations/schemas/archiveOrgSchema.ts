import { z } from "zod";

export const archiveOrgSchema = z.object({
  confirmName: z.string().min(1, "Organization name is required"),
});

export type ArchiveOrgFormValues = z.infer<typeof archiveOrgSchema>;
