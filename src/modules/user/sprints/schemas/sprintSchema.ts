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
    end_date: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true;
      return new Date(data.start_date) <= new Date(data.end_date);
    },
    {
      message: "End date must be after or equal to start date",
      path: ["end_date"],
    },
  );

export type CreateSprintInput = z.infer<typeof createSprintSchema>;
