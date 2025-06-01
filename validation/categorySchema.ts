import { z } from "zod";

export const categorySchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  icon_url: z.string().nullable().optional(),
});

export const categoryWithIdSchema = categorySchema.extend({
  id: z.string(),
});

// TypeScript types (optional)
export type Category = z.infer<typeof categorySchema>;
export type CategoryWithId = z.infer<typeof categoryWithIdSchema>;
