import { z } from "zod";

export const supplierSchema = z.object({
  images: z.array(z.record(z.any())).optional(),
  name: z.string().min(1, "Name is required"),
  contact_person: z.string().min(1, "Contact Name is required"),
  contact_title: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  alt_phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  fax: z.string().optional(),
  purpose: z.string().optional(),
  restrictions: z.string().optional(),
  contract_number: z.string().min(1, "Contract Number is required"),
  notes: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  preferred_delivery_days: z.string().optional(),
  operational_hours: z.string().optional(),
  is_active: z.boolean(),
});

export const supplierWithIdSchema = supplierSchema.extend({
  id: z.string(),
});

export type SupplierSchema = z.infer<typeof supplierSchema>;
export type SupplierWithIdSchema = z.infer<typeof supplierWithIdSchema>;
