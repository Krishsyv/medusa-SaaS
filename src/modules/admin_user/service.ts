import { MedusaService } from "@medusajs/framework/utils";
import { AdminUser } from "./models/admin_user";

class AdminUserService extends MedusaService({ AdminUser }) {}

export default AdminUserService;
