import type { MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  APP_MODULE,
  kitSchema,
  KitSchema,
  KitInput,
  APP_ENTITY,
  AuthenticatedRequest,
  linkEntities,
} from "src/constants";
import AcademyService from "src/modules//academy/service";
import { z } from "zod";

export const POST = async (req: AuthenticatedRequest, res: MedusaResponse) => {
  try {
    kitSchema.parse(req.body as KitSchema);
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );
    const body = req.body as KitInput;
    const get_kits = await academyService.listKits({
      portal_id: req.portal_id,
      product_id: body.product_id,
    });
    if (!!get_kits.length) {
      res.status(400).json({
        message: "Kit with this Product Id already exists in this Portal",
      });
      return;
    }
    const create_kit = await academyService.createKits({
      portal_id: req.portal_id,
      ...body,
    });

    await linkEntities(req.scope, {
      first_entity: Modules.PRODUCT,
      first_entity_id: body.product_id,
      second_entity: APP_ENTITY.kit,
      second_entity_id: create_kit.id,
    });

    res.status(200).json(create_kit);
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
      const get_kit = await academyService.retrieveKit(req.query.id as string);
      res.status(200).json(get_kit);
      return;
    }
    const { data: kits, metadata } = await query.graph({
      entity: APP_ENTITY.kit,
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
    kitSchema.parse(req.body as KitInput);
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );
    const body = req.body as KitInput;
    const update_kit = await academyService.updateKits({
      ...body,
      id: req.query.id,
      portal_id: req.portal_id,
    });

    res.status(200).json(update_kit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    }
    res.json(error);
  }
};
