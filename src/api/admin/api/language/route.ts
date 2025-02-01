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

    const get_languages = await academyService.listLanguages({
      portal_id: req.body.portal_id,
      name: req.body.name,
    });
    if (!!get_languages.length) {
      res
        .status(400)
        .json({ message: "language already exists in this portal" });
      return;
    }
    const create_language = await academyService.createLanguages(req.body);

    res.status(201).json(create_language);
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
      const get_language = await academyService.retrieveLanguage(
        req.query.id as string
      );
      res.status(200).json(get_language);
      return;
    }
    const get_languages = await academyService.listLanguages();
    res.status(200).json(get_languages);
  } catch (error) {
    res.json(error);
  }
};
