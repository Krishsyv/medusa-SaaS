import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  APP_MODULE,
  classKitSchema,
  ClassKitSchema,
  ClassKitInput,
} from "src/constants";
import AcademyService from "src/modules/academy/service";

export const POST = async (
  req: MedusaRequest<ClassKitInput>,
  res: MedusaResponse
) => {
  try {
    classKitSchema.parse(req.body as ClassKitSchema);
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );

    const get_class_kits = await academyService.listClassKits({
      portal_id: req.body.portal_id,
      kit_id: req.body.kit_id,
    });
    if (!!get_class_kits.length) {
      res.status(400).json({
        message: "Class Kit with this Kit Is already exists in this portal",
      });
      return;
    }
    const create_class_kit = await academyService.createClassKits(req.body);

    res.status(200).json(create_class_kit);
  } catch (error) {
    res.json(error);
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );
    if (req.query.id) {
      const get_class_kit = await academyService.restoreClassKits(
        req.query.id as string
      );
      res.status(200).json({ get_class_kit });
      return;
    }
    const get_class_kits = await academyService.listClassKits();
    res.status(200).json(get_class_kits);
  } catch (error) {
    res.json(error);
  }
};
