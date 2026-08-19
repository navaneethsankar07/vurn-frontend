import { z } from "zod";

export const updateRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  permissions: z.array(z.string()),
});

export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;
