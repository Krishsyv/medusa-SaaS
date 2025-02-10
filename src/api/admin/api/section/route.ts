import type { MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  APP_ENTITY,
  APP_MODULE,
  AuthenticatedRequest,
  NameInput,
  NameSchema,
  nameSchema,
} from "src/constants";
import AcademyService from "src/modules/academy/service";
import { z } from "zod";

export const POST = async (req: AuthenticatedRequest, res: MedusaResponse) => {
  try {
    nameSchema.parse(req.body as NameSchema);
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );
    const { name } = req.body as NameInput;
    const get_sections = await academyService.listSections({
      portal_id: req.portal_id,
      name,
    });
    if (!!get_sections.length) {
      res
        .status(400)
        .json({ message: "section already exists in this portal" });
      return;
    }
    const create_section = await academyService.createSections({
      portal_id: req.portal_id,
      name,
    });

    res.status(201).json(create_section);
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
      const get_section = await academyService.retrieveSection(
        req.query.id as string
      );
      res.status(200).json({ get_section });
      return;
    }

    const { data: sections, metadata } = await query.graph({
      entity: APP_ENTITY.section,
      fields: ["*"],
      filters: { portal_id: req.portal_id },
      pagination: {
        skip: Number(req.query.skip) || 0,
        take: Number(req.query.take) || 5,
      },
    });

    res.json({
      list: sections,
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
    nameSchema.parse(req.body as NameSchema);
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );
    const { name } = req.body as NameInput;
    const update_section = await academyService.updateSections({
      id: req.query.id,
      name,
    });
    res.status(200).json(update_section);
  } catch (error) {
    res.json(error);
  }
};
