import { z } from "zod";

export const createIssueSchema = z.object({
  issue_type: z.enum(["epic", "story", "task", "bug", "subtask"]),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters"),
  description: z.string().optional(),
  parent_id: z.string().optional(),
  sprint_id: z.string().optional(),
  status_id: z.string().optional(),
  assignee_id: z.string().optional(),
  priority: z.enum(["urgent", "high", "medium", "low"]),
  story_points: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
      "Story points must be 0 or greater",
    ),
});

export type CreateIssueFormValues = z.infer<typeof createIssueSchema>;
