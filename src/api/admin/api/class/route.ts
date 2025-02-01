import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { APP_MODULE, NameInput, NameSchema, nameSchema } from "src/constants";
import AcademyService from "src/modules/academy/service";

export const POST = async (
  req: MedusaRequest<NameInput>,
  res: MedusaResponse
) => {
  try {
    nameSchema.parse(req.body as NameSchema);
    const academyService: AcademyService = req.scope.resolve(APP_MODULE.ACADEMY);

    const get_classes = await academyService.listClasses({
      portal_id: req.body.portal_id,
      name: req.body.name,
    });
    if (!!get_classes.length) {
      res.status(400).json({ message: "Class already exists in this portal" });
      return;
    }
    const create_class = await academyService.createClasses(req.body);

    res.status(201).json({ create_class });
  } catch (error) {
    res.json(error);
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const academyService: AcademyService = req.scope.resolve(APP_MODULE.ACADEMY);
    if (req.query.id) {
      const get_class = await academyService.retrieveClass(
        req.query.id as string
      );
      res.status(200).json({ get_class });
      return;
    }
    const get_classes = await academyService.listClasses();
    res.status(200).json({ get_classes });
  } catch (error) {
    res.json(error);
  }
};
