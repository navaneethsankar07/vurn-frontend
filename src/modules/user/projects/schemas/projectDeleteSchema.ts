import z from "zod";

export const createDeleteProjectSchema = (expectedName: string) =>
  z.object({
    confirmation: z.string().refine((val) => val === expectedName, {
      message: `Please type "${expectedName}" to confirm.`,
    }),
  });

export type DeleteProjectFormData = { confirmation: string };
