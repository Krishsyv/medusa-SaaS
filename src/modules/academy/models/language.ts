import { model } from "@medusajs/framework/utils";
import { APP_ENTITY } from "src/constants";
import { Student } from "./student";

export const Language = model
  .define(APP_ENTITY.language, {
    id: model.id().primaryKey(),
    portal_id: model.text().searchable(),
    name: model.text().unique().searchable(),
    second_language_students: model.hasMany(() => Student, {
      mappedBy: "second_language",
    }),
    third_language_students: model.hasMany(() => Student, {
      mappedBy: "third_language",
    }),
    fourth_language_students: model.hasMany(() => Student, {
      mappedBy: "fourth_language",
    }),
  })
  .indexes([{ on: ["name", "portal_id"], unique: true }])
  .cascades({
    delete: [
      "second_language_students",
      "third_language_students",
      "fourth_language_students",
    ],
  });
