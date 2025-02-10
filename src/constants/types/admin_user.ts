import { ADMIN_ROLE } from "./global";

export type RegisterAdminUserInput = {
  portal_id: string;
  email: string;
  role: ADMIN_ROLE;
  first_name?: string;
  last_name?: string;
  password: string;
};
