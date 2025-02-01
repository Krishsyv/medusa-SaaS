import { model } from "@medusajs/framework/utils";
import { APP_ENTITY } from "src/constants";
import { StudentProfile } from "./student_profile";
import { Class } from "./class";
import { Section } from "./section";
import { Language } from "./language";

export const Student = model
  .define(APP_ENTITY.student, {
    id: model.id().primaryKey(),
    portal_id: model.text().searchable(),
    student_enrollment_code: model.text().searchable(),
    email: model.text(),
    student_name: model.text(),
    // relations
    student_profile: model.hasOne(() => StudentProfile),
    class: model.belongsTo(() => Class).nullable(),
    section: model.belongsTo(() => Section).nullable(),
    second_language: model
      .belongsTo(() => Language, {
        mappedBy: "second_language_students",
      })
      .nullable(),
    third_language: model
      .belongsTo(() => Language, {
        mappedBy: "third_language_students",
      })
      .nullable(),
    fourth_language: model
      .belongsTo(() => Language, {
        mappedBy: "fourth_language_students",
      })
      .nullable(),
  })
  .indexes([{ on: ["student_enrollment_code", "portal_id", "email"], unique: true }])
  .cascades({ delete: ["student_profile"] });