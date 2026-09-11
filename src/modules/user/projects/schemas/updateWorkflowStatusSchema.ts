import { z } from "zod";

export const updateWorkflowStatusSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Status name cannot be empty.")
    .max(60, "Status name must be 60 characters or less.")
    .optional(),
  category: z
    .enum(["backlog", "unstarted", "started", "completed", "cancelled"])
    .optional(),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9A-FA-f]{6}$/, "Enter a valid hex color code (e.g. #FF0000).")
    .optional(),
  icon: z.string().nullable().optional(),
  position: z.number().min(0, "Position must be 0 or greater.").optional(),
  is_default: z.boolean().optional(),
  is_archived: z.boolean().optional(),
  allow_from_backlog: z.boolean().optional(),
  allow_incoming: z.boolean().optional(),
  allow_outgoing: z.boolean().optional(),
});

export type UpdateWorkflowStatusFormValues = z.infer<
  typeof updateWorkflowStatusSchema
>;
