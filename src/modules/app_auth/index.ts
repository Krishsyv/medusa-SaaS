import AppAuthProviderService from "./service";
import { ModuleProvider, Modules } from "@medusajs/framework/utils";

export default ModuleProvider(Modules.AUTH, {
  services: [AppAuthProviderService],
});
