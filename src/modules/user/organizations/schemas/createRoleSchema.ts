import { z } from "zod";

const isColorTooDark = (hexColor: string): boolean => {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) return false;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.25;
};

const NAME_REGEX = /^[a-zA-Table0-9_\- ]+$/;

const SAFE_TEXT_REGEX = /^[a-zA-Z0-9_\-\s.,'":;()!?]+$/;

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Role name is required.")
    .min(2, "Role name must be at least 2 characters.")
    .max(50, "Role name cannot exceed 50 characters.")
    .regex(
      NAME_REGEX,
      "Role name can only contain letters, numbers, spaces, hyphens, and underscores.",
    ),
  description: z
    .string()
    .trim()
    .max(255, "Description cannot exceed 255 characters.")
    .refine(
      (val) => val === "" || SAFE_TEXT_REGEX.test(val),
      "Description contains invalid or unsafe characters.",
    )
    .optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/, "Invalid color format.")
    .refine((val) => !isColorTooDark(val), {
      message: "Please select a lighter color so text remains readable.",
    }),
  permissions: z.array(z.string()),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;