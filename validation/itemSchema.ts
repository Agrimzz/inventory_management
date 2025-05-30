import { z } from "zod";

const productAttributeSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

const productSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category_id: z.number().optional(),
  category: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    icon_url: z.string().optional(),
  }),
  unit_id: z.number(),
  unit: z.object({
    symbol: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
  }),
  expiry_date: z.string().nullable().optional(),
  serial_number: z.string().nullable().optional(),
  product_condition: z.enum(["Brand New", "Used", "Refurbished"]),
  manufacture_date: z.string().nullable().optional(),
  warranty_period: z.number().nullable().optional(),
  images: z.array(z.any()).optional(),
  product_attributes: z.array(productAttributeSchema).optional(),
});

export const itemSchema = z.object({
  warehouse_id: z.string(),
  batch_id: z.string(),
  product: productSchema,
  quantity: z.string().min(1),
  availability: z.boolean(),
  images: z.array(z.any()).optional(),
});

export const itemWithIdSchema = itemSchema.extend({
  id: z.string(),
});

export type ItemSchema = z.infer<typeof itemSchema>;
export type ItemWithIdSchema = z.infer<typeof itemWithIdSchema>;
