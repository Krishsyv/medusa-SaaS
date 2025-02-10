import { z } from "zod";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import registerAdminUserWorkflow from "src/workflows/register_admin_user";
import {
  APP_MODULE,
  RegisterAdminUserInput,
  registerAdminUserSchema,
  RegisterAdminUserSchema,
} from "src/constants";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function POST(
  req: MedusaRequest<RegisterAdminUserInput>,
  res: MedusaResponse
): Promise<void> {
  try {
    registerAdminUserSchema.parse(req.body as RegisterAdminUserSchema);
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
    const { result, errors } = await registerAdminUserWorkflow(req.scope).run({
      input: { ...req.body },
      throwOnError: false,
    });

    if (errors && errors.length > 0) {
      res.status(500).json({
        message: errors[0].error.message,
        type: "Admin User Register Workflow Error",
      });
      return;
    }

    res.status(201).json({
      message: "Admin registered successfully",
      result,
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    }
    res.json(error);
    return;
  }
}
