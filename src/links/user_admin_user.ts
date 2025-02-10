import { defineLink } from "@medusajs/framework/utils";
import UserModule from "@medusajs/medusa/user";
import AdminUserModule from "src/modules/admin_user";

// Extend Data Model link
export default defineLink(
  UserModule.linkable.user,
  AdminUserModule.linkable.adminUser
);
