import { z } from "zod";
import { CLASS_KIT_TYPE } from "../types";

export const kitSchema = z.object({
  product_id: z.string().min(1, { message: "Product Id is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  qty: z.number().min(1, { message: "Quantity is required" }),
  academic_id: z.string().min(1, { message: "Academic Id is required" }),
  status: z.boolean().optional(),
});

export type KitSchema = z.infer<typeof kitSchema>;

export const classKitSchema = z.object({
  kit_id: z.string().min(1, { message: "Kit Id is required" }),
  class_id: z.string().min(1, { message: "Class Id is required" }),
  type: z.nativeEnum(CLASS_KIT_TYPE, {
    errorMap: () => ({
      message: `Type must be either '${CLASS_KIT_TYPE.BUNDLE}' or '${CLASS_KIT_TYPE.FREE}'`,
    }),
  }),
  is_customizable: z.boolean().optional(),
  second_language: z
    .string()
    .min(1, { message: "Second Language is required" }),
  third_language: z
    .string()
    .min(1, { message: "Third Language is required" })
    .optional(),
  third_language_status: z.boolean().optional(),
  status: z.boolean().optional(),
});

export type ClassKitSchema = z.infer<typeof classKitSchema>;

export const academicInputSchema = z.object({
  year: z.string().min(1, { message: "year is required" }),
  year_number: z.number().min(1, { message: "year_number is required" }),
  kit_id: z.string().optional(),
});

export type AcademicSchema = z.infer<typeof classKitSchema>;