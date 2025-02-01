import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
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
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    if (req.query.id) {
      const get_class = await academyService.retrieveClass(
        req.query.id as string
      );
      res.status(200).json({ get_class });
      return;
    }

    const { data: classes, metadata } = await query.graph({
      entity: "class",
      fields: ["id", "name"],
      pagination: {
        skip: Number(req.query.skip) || 0,
        take: Number(req.query.limit) || 5,
      },
    });

    res.json({
      list: classes,
      count: metadata?.count,
      limit: Number(req.query.skip),
      offset: Number(req.query.limit),
    });
  } catch (error) {
    res.json(error);
  }
};
