import { model } from "@medusajs/framework/utils";
import { ADMIN_ROLE, APP_ENTITY } from "src/constants";

// linked with user for authentication
// store admin_user id as user email to maintain uniqueness
export const AdminUser = model
  .define(APP_ENTITY.admin_user, {
    id: model.id().primaryKey(),
    portal_id: model.text().unique().searchable(),
    email: model.text().unique().searchable(),
    role: model.enum(ADMIN_ROLE).default(ADMIN_ROLE.ADMIN),
  })
  .indexes([
    {
      on: ["portal_id", "email"],
      unique: true,
    },
  ]);
