import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  APP_MODULE,
  classKitSchema,
  ClassKitSchema,
  ClassKitInput,
  APP_ENTITY,
  AuthenticatedRequest,
} from "src/constants";
import AcademyService from "src/modules/academy/service";
import { z } from "zod";

export const POST = async (req: AuthenticatedRequest, res: MedusaResponse) => {
  try {
    classKitSchema.parse(req.body as ClassKitSchema);
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );
    const body = req.body as ClassKitInput;
    const get_class_kits = await academyService.listClassKits({
      portal_id: req.portal_id,
      kit_id: body.kit_id,
    });
    if (!!get_class_kits.length) {
      res.status(400).json({
        message: "Class Kit with this Kit Id already exists in this portal",
      });
      return;
    }
    const create_class_kit = await academyService.createClassKits({
      ...body,
      kit: body.kit_id,
      portal_id: req.portal_id,
    });

    res.status(200).json(create_class_kit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    }
    res.json(error);
  }
};

export const GET = async (req: AuthenticatedRequest, res: MedusaResponse) => {
  try {
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    if (req.query.id) {
      const get_class_kit = await academyService.retrieveClassKit(
        req.query.id as string
      );
      res.status(200).json(get_class_kit);
      return;
    }
    const { data: kits, metadata } = await query.graph({
      entity: APP_ENTITY.class_kit,
      fields: ["*"],
      filters: { portal_id: req.portal_id },
      pagination: {
        skip: Number(req.query.skip) || 0,
        take: Number(req.query.take) || 5,
      },
    });

    res.json({
      list: kits,
      count: metadata?.count,
      limit: Number(req.query.skip),
      offset: Number(req.query.take),
    });
  } catch (error) {
    res.json(error);
  }
};

export const PATCH = async (req: AuthenticatedRequest, res: MedusaResponse) => {
  try {
    classKitSchema.parse(req.body as ClassKitSchema);
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );

    const update_class_kit = await academyService.updateClassKits({
      ...req.body as ClassKitInput,
      portal_id: req.portal_id,
    });
    res.status(200).json(update_class_kit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    }
    res.json(error);
  }
};
