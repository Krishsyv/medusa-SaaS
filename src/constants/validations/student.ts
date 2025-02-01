import { z } from "zod";
import { alphanumeric } from "src/constants";

export const registerStudentSchema = z.object({
	portal_id: z
		.string()
		.min(1, { message: "Portal ID cannot be empty" })
		.regex(alphanumeric.exp, {
			message: `Portal ID ${alphanumeric.msg}`,
		})
		.max(50, { message: "Portal ID must not exceed 50 characters" }),

	student_enrollment_code: z
		.string()
		.min(1, { message: "Student Enrollment code cannot be empty" })
		.regex(alphanumeric.exp, {
			message: `Student Enrollment code ${alphanumeric.msg}`,
		})
		.max(50, {
			message: "Student Enrollment code must not exceed 50 characters",
		}),

	email: z.string().email({ message: "Invalid email address" }),

	first_name: z.string().min(1, { message: "First name cannot be empty" }),
	last_name: z.string().min(1, { message: "Last name cannot be empty" }),
});

export type RegisterStudentSchema = z.infer<typeof registerStudentSchema>;


export const studentProfileSchema = z.object({
  student_name: z.string().optional(),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  mother_phone: z
    .string()
    .regex(/^\d{10}$/, "Mother phone must be a valid 10-digit number")
    .optional(),
  mother_email: z
    .string()
    .email("Mother email must be a valid email address")
    .optional(),
  gender: z.string().optional(),
  hap: z.number().optional(),
  hasdp: z.number().optional(),
  first_term_paid: z.boolean().optional(),
  house: z.string().optional(),
  ai: z.boolean().optional(),
  academic_year: z.number().optional(),
  date_of_admission: z.date().optional(),
  application_no: z.number().optional(),
  locality: z.string().optional(),
  otp: z.string().optional(),
  active: z.boolean().optional(),
  referral_code: z.string().optional(),
  is_sheffler: z.boolean().optional(),
  // relations
  class: z.string().optional(),
  section: z.string().optional(),
  second_language: z.string().optional(),
  third_language: z.string().optional(),
  fourth_language: z.string().optional(),
});

export type StudentProfileSchema = z.infer<typeof studentProfileSchema>;

