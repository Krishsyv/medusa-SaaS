import { model } from "@medusajs/framework/utils";
import { APP_ENTITY } from "src/constants";
import { Student } from "./student";
import { ClassKit } from "./class_kit";

export const Class = model
	.define(APP_ENTITY.class, {
		id: model.id().primaryKey(),
		portal_id: model.text().searchable(),
		name: model.text().unique().searchable(),
		students: model.hasMany(() => Student),
		class_kit: model.belongsTo(() => ClassKit).nullable(),
	})
	.indexes([{ on: ["name", "portal_id"], unique: true }])
	.cascades({ delete: ["students"] });