import {
  authenticate,
  defineMiddlewares,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { MedusaError, Modules } from "@medusajs/framework/utils";
import {
  APP_MODULE,
  AuthenticatedRequest,
  setCustomerAuthContextRequest,
  setUserAuthContextRequest,
} from "src/constants";
import { z } from "zod";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/*",
      middlewares: [setCustomerAuthContextRequest],
    },
    {
      matcher: "/admin/*",
      middlewares: [setUserAuthContextRequest],
    },
  ],
});
