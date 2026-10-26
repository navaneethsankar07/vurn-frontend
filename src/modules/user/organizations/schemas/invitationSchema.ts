import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  permission_role: z.enum(["admin", "member"]),
  job_role_id: z.string().min(1, "Please select a job role"),
  personal_message: z.string().optional(),
  send_email: z.boolean(),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
