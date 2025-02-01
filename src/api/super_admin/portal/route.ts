import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { APP_MODULE } from "src/constants";
import PortalService from "src/modules/portal/service";
import { PortalInput, portalSchema, PortalSchema } from "./validation";

export const POST = async (req: MedusaRequest<PortalInput>, res: MedusaResponse) => {
  try {
     portalSchema.parse(req.body as PortalSchema);
    const portalService: PortalService = req.scope.resolve(APP_MODULE.PORTAL);
    const create_portal = await portalService.createPortals(req.body);
    res.status(201).json(create_portal);
  } catch (error) {
    res.json(error);
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const portalService: PortalService = req.scope.resolve(APP_MODULE.PORTAL);
    const get_portals = await portalService.listPortals();
    res.status(200).json(get_portals);
  } catch (error) {
    res.json(error);
  }
};
