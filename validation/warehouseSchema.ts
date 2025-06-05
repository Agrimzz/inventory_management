import { z } from "zod";

export const warehouseSchema = z.object({
  images: z.array(z.record(z.any())).optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  manager_name: z.string().optional(),

  address_line1: z.string().min(1, "Address Line 1 is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z
    .string()
    .min(1, "Postal Code is required")
    .regex(/^\d+$/, "Postal Code must contain digits only"),
  country: z.string().min(1, "Country is required"),

  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\d+$/, "Phone must contain digits only"),

  alt_phone: z
    .string()
    .regex(/^\d+$/, "Alternate phone must contain digits only")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email address"),
  fax: z.string().optional(),

  storage_capacity: z.string(),
  current_storage: z.string(),
  min_threshold: z.string(),
  max_threshold: z.string(),
  temperature_controlled: z.boolean(),
  hazard_compatible: z.boolean(),
  fire_safety_certified: z.boolean(),

  last_safety_audit: z.string().optional(),
  operational_hours: z.string().optional(),
  closed_days: z.string().optional(),
});

export const warehouseWithIdSchema = warehouseSchema.extend({
  id: z.string(),
});

export type WarehouseSchema = z.infer<typeof warehouseSchema>;
export type WarehouseWithIdSchema = z.infer<typeof warehouseWithIdSchema>;
