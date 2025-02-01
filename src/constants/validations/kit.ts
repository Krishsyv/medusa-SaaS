import { z } from "zod";

export const kitSchema = z.object({
  portal_id: z.string().min(1, { message: "Portal Id is required" }),
  product_id: z.string().min(1, { message: "Product Id is required" }),
  qty: z.number().min(1, { message: "Quantity is required" }),
  status: z.boolean().optional(),
});

export type KitSchema = z.infer<typeof kitSchema>;


export const classKitSchema = z.object({
  portal_id: z.string().min(1, { message: "Portal Id is required" }),
  kit_id: z.string().min(1, { message: "Kit Id is required" }),
  class_id: z.string().min(1, { message: "Class Id is required" }),
  second_language: z
    .string()
    .min(1, { message: "Second Language is required" }),
  third_language: z.string().min(1, { message: "Third Language is required" }),
  third_language_status: z.boolean().optional(),
});

export type ClassKitSchema = z.infer<typeof classKitSchema>;

