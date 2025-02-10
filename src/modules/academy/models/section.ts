import { model } from "@medusajs/framework/utils";
import { APP_ENTITY } from "src/constants";
import { Student } from "./student";

export const Section = model
	.define(APP_ENTITY.section, {
		id: model.id().primaryKey(),
		portal_id: model.text().searchable(),
		name: model.text().unique().searchable(),
		students: model.hasMany(() => Student),
	})
	.indexes([{ on: ["name", "portal_id"], unique: true }])
	.cascades({ delete: ["students"] });