import { z } from "zod";
import { alphanumeric } from "src/constants";

export const registerAdminUserSchema = z.object({
	portal_id: z
		.string()
		.min(1, { message: "Portal ID cannot be empty" })
		.regex(alphanumeric.exp, {
			message: `Portal ID ${alphanumeric.msg}`,
		})
		.max(50, { message: "Portal ID must not exceed 50 characters" }),

	email: z.string().email({ message: "Invalid email address" }),

	first_name: z.string().min(1, { message: "First name cannot be empty" }),
	last_name: z.string().min(1, { message: "Last name cannot be empty" }),
	password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type RegisterAdminUserSchema = z.infer<typeof registerAdminUserSchema>;
