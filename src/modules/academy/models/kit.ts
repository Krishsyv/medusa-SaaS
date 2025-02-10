import { model } from "@medusajs/framework/utils";
import { APP_ENTITY } from "src/constants";
import { ClassKit } from "./class_kit";
import { Academic } from "./academic";

export const Kit = model.define(APP_ENTITY.kit, {
  id: model.id().primaryKey(),
  name: model.text().unique().searchable(),
  portal_id: model.text().searchable(),
  product_id: model.text().searchable(),
  academic_id: model.text(),
  qty: model.number().default(0),
  status: model.boolean().default(false),
  academic: model.belongsTo(() => Academic).nullable(),
	class_kit: model.belongsTo(() => ClassKit).nullable(),
}).indexes([{ on: ["product_id", "portal_id"], unique: true }]);