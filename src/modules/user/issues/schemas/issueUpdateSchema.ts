import { z } from "zod";

export const issueUpdateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Issue title cannot be empty.")
    .max(255, "Title cannot exceed 255 characters.")
    .optional(),
  description: z.string().optional(),
  parent_id: z.number().int().positive().nullable().optional(),
  sprint_id: z.number().int().positive().nullable().optional(),
  status_id: z.number().int().positive().optional(),
  assignee_id: z.number().int().positive().nullable().optional(),
  priority: z.enum(["urgent", "high", "medium", "low"]).optional(),
  story_points: z.number().int().min(0).nullable().optional(),
});

export const addLabelSchema = z
  .object({
    label_id: z.number().int().positive().optional(),
    name: z.string().trim().max(50).optional(),
    color: z.string().trim().max(7).default("#999999"),
  })
  .refine(
    (data) => (data.label_id && !data.name) || (!data.label_id && data.name),
    {
      message: "Provide either label_id or name, but not both.",
    },
  );
