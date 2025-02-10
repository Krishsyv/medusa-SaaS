import { model } from "@medusajs/framework/utils";
import { APP_ENTITY } from "src/constants";
import { Kit } from "./kit";

export const Academic = model.define(APP_ENTITY.academic, {
	id: model.id().primaryKey(),
	portal_id: model.text().searchable(),
	year: model.text().searchable(),
	year_number: model.text(),
	kit: model.hasOne(() => Kit).nullable(),
}).indexes([{ on: ["year", "portal_id"], unique: true }]);