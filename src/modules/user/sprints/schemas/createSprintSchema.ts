import { z } from "zod";

export const createSprintSchema = z
  .object({
    name: z
      .string()
      .min(1, "Sprint name is required")
      .max(150, "Name must be 150 characters or less"),
    goal: z.string().optional(),
    description: z.string().optional(),
    start_date: z.string().min(1, "Start date is required"),
    duration_type: z.enum(["preset", "custom"]),
    preset_days: z.number().optional(),
    estimated_days: z.number().optional(),
    end_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.duration_type === "custom") {
        if (!data.end_date || !data.start_date) return false;
        return new Date(data.start_date) <= new Date(data.end_date);
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["end_date"],
    },
  );

export type CreateSprintInput = z.infer<typeof createSprintSchema>;
