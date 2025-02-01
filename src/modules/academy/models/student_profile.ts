import { model } from "@medusajs/framework/utils";
import { APP_ENTITY, GENDER } from "src/constants";
import { Student } from "./student";

export const StudentProfile = model.define(APP_ENTITY.student_profile, {
  id: model.id().primaryKey(),
  portal_id: model.text(),
  student_enrollment_code: model.text(),
  father_name: model.text().nullable(),
  mother_name: model.text().nullable(),
  mother_phone: model.text().nullable(),
  mother_email: model.text().nullable(),
  gender: model.enum(GENDER).nullable(),
  hap: model.number().nullable(),
  hasdp: model.number().nullable(),
  first_term_paid: model.boolean().default(false),
  house: model.text().nullable(),
  ai: model.boolean().nullable(),
  academic_year: model.number().nullable(),
  date_of_admission: model.dateTime().nullable(),
  application_no: model.number().nullable(),
  locality: model.text().nullable(),
  otp: model.text().nullable(),
  active: model.boolean().nullable(),
  referral_code: model.text().nullable(),
  is_sheffler: model.boolean().nullable(),
  student_references_code: model.text().nullable(),
  // relations
  student: model.belongsTo(() => Student),
});