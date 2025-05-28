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
  postal_code: z.string().min(1, "Postal Code is required"),
  country: z.string().min(1, "Country is required"),

  phone: z.string().min(1, "Phone is required"),
  alt_phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  fax: z.string().optional(),

  storage_capacity: z
    .number({ invalid_type_error: "Storage Capacity must be a number" })
    .min(0),
  current_storage: z
    .number({ invalid_type_error: "Current Storage must be a number" })
    .min(0),
  min_threshold: z
    .number({ invalid_type_error: "Min Threshold must be a number" })
    .min(0),
  max_threshold: z
    .number({ invalid_type_error: "Max Threshold must be a number" })
    .min(0),

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
