import { model } from "@medusajs/framework/utils";
import { APP_ENTITY } from "src/constants";
import { ClassKit } from "./class_kit";

export const Kit = model.define(APP_ENTITY.kit, {
  id: model.id().primaryKey(),
  portal_id: model.text().searchable(),
  product_id: model.text().searchable(),
  qty: model.number().default(0),
  status: model.boolean().default(false),
	class_kit: model.belongsTo(() => ClassKit),
}).indexes([{ on: ["product_id", "portal_id"], unique: true }]);