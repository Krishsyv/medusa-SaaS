import { z } from "zod";

export const nameSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});
export type NameSchema = z.infer<typeof nameSchema>;

