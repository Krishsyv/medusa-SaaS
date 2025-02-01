import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { APP_MODULE, kitSchema, KitSchema, KitInput } from "src/constants";
import AcademyService from "src/modules//academy/service";

export const POST = async (
  req: MedusaRequest<KitInput>,
  res: MedusaResponse
) => {
  try {
    kitSchema.parse(req.body as KitSchema);
    const academyService: AcademyService = req.scope.resolve(APP_MODULE.ACADEMY);

    const get_kits = await academyService.listKits({
      portal_id: req.body.portal_id,
      product_id: req.body.product_id,
    });
    if (!!get_kits.length) {
      res
        .status(400)
        .json({
          message: "Kit with this Product Id already exists in this Portal",
        });
      return;
    }
    const create_kit = await academyService.createKits(req.body);

    res.status(200).json({ create_kit });
  } catch (error) {
    res.json(error);
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const academyService: AcademyService = req.scope.resolve(APP_MODULE.ACADEMY);
    if (req.query.id) {
      const get_kit = await academyService.retrieveKit(req.query.id as string);
      res.status(200).json(get_kit);
      return;
    }
    const get_kits = await academyService.listKits();
    res.status(200).json(get_kits);
  } catch (error) {
    res.json(error);
  }
};
