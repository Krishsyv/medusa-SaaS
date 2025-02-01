import { z } from "zod";

export const portalSchema = z.object({
  portal_id: z.string().min(1, { message: "Portal Id is required" }),
});

export type PortalSchema = z.infer<typeof portalSchema>;

export type PortalInput = {
  portal_id: string;
};
