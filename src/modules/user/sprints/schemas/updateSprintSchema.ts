import { z } from "zod";

export const updateSprintSchema = z
  .object({
    name: z.string().trim().min(1, "Sprint name cannot be empty."),
    goal: z.string().optional(),
    description: z.string().optional(),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.start_date) <= new Date(data.end_date);
      }
      return true;
    },
    {
      message: "End date must be after or equal to the start date.",
      path: ["end_date"],
    },
  );

export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;
