import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { APP_MODULE, NameInput, NameSchema, nameSchema } from "src/constants";
import AcademyService from "src/modules/academy/service";

export const POST = async (
  req: MedusaRequest<NameInput>,
  res: MedusaResponse
) => {
  try {
    nameSchema.parse(req.body as NameSchema);
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );

    const get_sections = await academyService.listSections({
      portal_id: req.body.portal_id,
      name: req.body.name,
    });
    if (!!get_sections.length) {
      res
        .status(400)
        .json({ message: "section already exists in this portal" });
      return;
    }
    const create_section = await academyService.createSections(req.body);

    res.status(201).json(create_section);
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
      const get_section = await academyService.retrieveSection(
        req.query.id as string
      );
      res.status(200).json({ get_section });
      return;
    }
    const get_sections = await academyService.listSections();
    res.status(200).json(get_sections);
  } catch (error) {
    res.json(error);
  }
};
