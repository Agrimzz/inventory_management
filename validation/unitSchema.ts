import { z } from "zod";

export const unitSchema = z.object({
  name: z.string(),
  symbol: z.string(),
});

export const unitWithIdSchema = unitSchema.extend({
  id: z.string(),
});

export type Unit = z.infer<typeof unitSchema>;
export type UnitWithId = z.infer<typeof unitWithIdSchema>;
