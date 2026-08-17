import { z } from "zod";

export const brandingSettingsSchema = z.object({
  accent_color: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  logo_url: z.string().optional().nullable(),
});

export type BrandingSettingsFormValues = z.infer<typeof brandingSettingsSchema>;
