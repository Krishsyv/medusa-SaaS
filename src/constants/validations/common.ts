import { z } from "zod";

export const nameSchema = z.object({
  portal_id: z.string().min(1, { message: "Portal Id is required" }),
  name: z.string().min(1, { message: "class name is required" }),
});

export type NameSchema = z.infer<typeof nameSchema>;

