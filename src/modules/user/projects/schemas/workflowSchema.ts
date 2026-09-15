import { z } from "zod";

export const updateStatusPositionSchema = z.object({
  position: z
    .number()
    .int()
    .min(0, "Position must be greater than or equal to 0"),
});

export type UpdateStatusPositionInput = z.infer<
  typeof updateStatusPositionSchema>;
