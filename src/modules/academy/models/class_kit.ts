import { model } from "@medusajs/framework/utils";
import { APP_ENTITY, CLASS_KIT_TYPE } from "src/constants";
import { Kit } from "./kit";
import { Class } from "./class";

export const ClassKit = model
  .define(APP_ENTITY.class_kit, {
    id: model.id().primaryKey(),
    portal_id: model.text().searchable(),
    kit_id: model.text().searchable(),
    class_id: model.text().searchable(),
    type: model.enum(CLASS_KIT_TYPE),
    is_customizable: model.boolean().default(false),
    second_language: model.text(),
    third_language: model.text().nullable(),
    third_language_status: model.boolean().default(false),
    status: model.boolean().default(false),
    kit: model.hasOne(() => Kit).nullable(),
    class: model.hasOne(() => Class).nullable(),
  })
  .indexes([{ on: ["portal_id"] }]);
