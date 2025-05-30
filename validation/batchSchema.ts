import { z } from "zod";

export const batchSchema = z.object({
  batch_name: z.string().min(1),
  description: z.string().min(1).optional(),
  supplier_id: z.string().min(1),
  casuse: z.string().optional(),
});

export const batchWithIdSchema = batchSchema.extend({
  id: z.string(),
});

export type BatchSchema = z.infer<typeof batchSchema>;
export type BatchWithIdSchema = z.infer<typeof batchWithIdSchema>;
