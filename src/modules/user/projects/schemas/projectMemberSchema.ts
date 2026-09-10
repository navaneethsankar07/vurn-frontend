import { z } from "zod";

export const addProjectMemberSchema = z.object({
  user_id: z.number({
    error: "Please select an organization member",
  }),
  project_role: z.string().optional(),
});

export type AddProjectMemberFormValues = z.infer<typeof addProjectMemberSchema>;
