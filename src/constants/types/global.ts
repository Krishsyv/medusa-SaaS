import { AuthenticatedMedusaRequest } from "@medusajs/framework";

export interface AuthenticatedRequest extends AuthenticatedMedusaRequest {
  portal_id?: string;
  student_enrollment_code?: string;
  email?: string;
}

export enum ACTOR_TYPE {
  USER = "user",
  CUSTOMER = "customer",
}

export enum ADMIN_ROLE {
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export enum APP_MODULE {
  PORTAL = "portal",
  APP_AUTH = "app_auth",
  ACADEMY = "academy",
  ADMIN_USER = "admin_user",
}

export enum APP_ENTITY {
  // super Admin (ALL)
  portal = "portal",
  // Admin
  class = "class",
  section = "section",
  language = "language",
  admin_user = "admin_user",
  academic = "academic",
  // Student
  kit = "kit",
  student = "student",
  class_kit = "class_kit",
  student_profile = "student_profile",
}
