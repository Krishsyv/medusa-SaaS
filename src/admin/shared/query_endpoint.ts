enum PREFIX {
  ADMIN = "/admin", // for default api
  ADMIN_API = "/admin/api", // for custom api
}

export enum ENDPOINT {
  // auth
  register = "/auth/register_admin",
  login = "/auth/user/app_auth",
  session = "/auth/session",
  // kits
  kit = `${PREFIX.ADMIN_API}/kit`,
  class_kit = `${PREFIX.ADMIN_API}/class_kit`,
  // academy
  class = `${PREFIX.ADMIN_API}/class`,
  section = `${PREFIX.ADMIN_API}/section`,
  language = `${PREFIX.ADMIN_API}/language`,
  //default
  get_products = `${PREFIX.ADMIN}/products`,
}
