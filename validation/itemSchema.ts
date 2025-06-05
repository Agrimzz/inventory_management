import { z } from "zod";

const productAttributeSchema = z.object({
  key: z.string().min(1, "Attribute key is required"),
  value: z.string().min(1, "Attribute value is required"),
});

const productSchema = z.object({
  sku: z.string().min(1, { message: "SKU is required" }),
  name: z.string().min(1, { message: "Product name is required" }),
  description: z.string().optional(),
  category_id: z.string().optional(),
  // category: z
  //   .object({
  //     name: z.string().min(1, { message: "Category name is required" }),
  //     description: z.string().optional(),
  //     icon_url: z.string().optional(),
  //   })
  //   .optional(),
  unit_id: z.string({ required_error: "Unit is required" }),
  // unit: z
  //   .object({
  //     symbol: z
  //       .string()
  //       .min(1, { message: "Unit symbol is required" })
  //       .optional(),
  //     name: z.string().min(1, { message: "Unit name is required" }).optional(),
  //   })
  //   .optional(),
  expiry_date: z.string().nullable().optional(),
  serial_number: z.string().nullable().optional(),
  product_condition: z.enum(["Brand New", "Used", "Refurbished"], {
    required_error: "Product condition is required",
  }),
  manufacture_date: z.string().nullable().optional(),
  warranty_period: z.number().nullable().optional(),
  images: z.array(z.any()).optional(),
  attributes: z
    .array(productAttributeSchema)
    .refine((val) => val.length === 0 || val.every((v) => v.key && v.value), {
      message: "Attributes must have both key and value",
    })
    .optional(),
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

export interface ItemDetailSchema {
  id: number;
  quantity: string;
  availability: boolean;
  created_at: string;
  updated_at: string;

  batch: {
    id: number;
    batch_name: string;
    cause?: string | null;
    created_at: string;
  };

  product: {
    id: number;
    name: string;
    sku: string;
    description?: string;
    serial_number?: string | null;
    product_condition: "Brand New" | "Used" | "Refurbished";
    manufacture_date?: string | null;
    expiry_date?: string | null;
    warranty_period?: string | null;
    created_at: string;
    updated_at: string;

    unit: {
      id: number;
      name?: string;
      symbol?: string;
    };

    category?: {
      id?: number;
      name: string;
      description?: string;
      icon_url?: string;
    };

    attributes?: {
      key: string;
      value: string;
    }[];

    images?: {
      id: number;
      upload: string; // URL of the image
    }[];
  };

  warehouse: {
    id: number;
    name: string;
    code: string;
    manager_name: string;
    email: string;
    phone: string;
    alt_phone: string;
    fax: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    coordinates?: string | null;
    zone?: string | null;
    current_storage: string;
    storage_capacity: string;
    min_threshold: string;
    max_threshold: string;
    is_active: boolean;
    temperature_controlled: boolean;
    hazard_compatible: boolean;
    fire_safety_certified: boolean;
    last_safety_audit: string;
    closed_days: string;
    operational_hours: string;
    created_at: string;
    updated_at: string;

    images?: {
      id: number;
      upload: string; // URL of the image
    }[];
  };
}
