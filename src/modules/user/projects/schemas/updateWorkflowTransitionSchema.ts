import { z } from "zod";

export const updateWorkflowTransitionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .max(60, "Transition name must not exceed 60 characters")
      .optional()
      .or(z.literal("")),
    from_status_id: z.string().min(1, "Origin status is required"),
    to_status_id: z.string().min(1, "Target status is required"),
  })
  .refine((data) => data.from_status_id !== data.to_status_id, {
    message: "Source and destination statuses must be distinct.",
    path: ["to_status_id"],
  });

export type UpdateWorkflowTransitionFormValues = z.infer<
  typeof updateWorkflowTransitionSchema
>;
