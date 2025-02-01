import { AuthenticatedMedusaRequest } from "@medusajs/framework";

export interface AuthenticatedRequest extends AuthenticatedMedusaRequest {
  portal_id?: string;
  student_enrollment_code?: string;
}

export enum APP_MODULE {
  PORTAL = "portal",
  APP_AUTH = "app_auth",
  ACADEMY = "academy",
}

export enum APP_ENTITY {
  // super Admin (ALL)
  portal = "portal",
  // Admin
  class = "class",
  section = "section",
  language = "language",
  // Student
  kit = "kit",
  student = "student",
  class_kit = "class_kit",
  student_profile = "student_profile",
}
