import type { MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  APP_MODULE,
  academicInputSchema,
  AcademicSchema,
  AcademicInput,
  APP_ENTITY,
  AuthenticatedRequest,
} from "src/constants";
import AcademyService from "src/modules//academy/service";
import { z } from "zod";

export const POST = async (req: AuthenticatedRequest, res: MedusaResponse) => {
  try {
    academicInputSchema.parse(req.body as AcademicSchema);
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );
    const body = req.body as AcademicInput;
    const get_academics = await academyService.listAcademics({
      portal_id: req.portal_id,
      product_id: body.year,
    });
    if (!!get_academics.length) {
      res.status(400).json({
        message: "Academic year already exists in this Portal",
      });
      return;
    }
    const create_academic = await academyService.createAcademics({
      portal_id: req.portal_id,
      ...body,
    });

    res.status(200).json(create_academic);
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
      const get_academic = await academyService.restoreAcademics(req.query.id as string);
      res.status(200).json(get_academic);
      return;
    }
    const { data: academics, metadata } = await query.graph({
      entity: APP_ENTITY.academic,
      fields: ["*"],
      filters: { portal_id: req.portal_id },
      pagination: {
        skip: Number(req.query.skip) || 0,
        take: Number(req.query.take) || 5,
      },
    });

    res.json({
      list: academics,
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
    academicInputSchema.parse(req.body as AcademicInput);
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );
    const body = req.body as AcademicInput;
    const update_academic = await academyService.updateAcademics({
      ...body,
      id: req.query.id,
      portal_id: req.portal_id,
    });

    res.status(200).json(update_academic);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    }
    res.json(error);
  }
};
