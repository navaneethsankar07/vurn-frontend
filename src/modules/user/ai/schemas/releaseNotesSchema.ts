import { z } from "zod";

export const releaseNotesSchema = z
  .object({
    repository_id: z.number("Please select a repository." ),
    start_date: z.string().min(1, "Start date is required."),
    end_date: z.string().min(1, "End date is required."),
  })
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true;
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end >= start;
    },
    {
      message: "End date must not precede start date.",
      path: ["end_date"],
    },
  )
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true;
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 1801;
    },
    {
      message: "Maximum date range is 181 calendar days.",
      path: ["end_date"],
    },
  );

export type ReleaseNotesFormValues = z.infer<typeof releaseNotesSchema>;
