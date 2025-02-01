import { z } from "zod";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import registerStudentWorkflow from "src/workflows/register_student";
import {
  RegisterStudentInput,
  registerStudentSchema,
  RegisterStudentSchema,
} from "src/constants";

export async function POST(
  req: MedusaRequest<RegisterStudentInput>,
  res: MedusaResponse
): Promise<void> {
  try {
    registerStudentSchema.parse(req.body as RegisterStudentSchema);
    const { result, errors } = await registerStudentWorkflow(req.scope).run({
      input: { ...req.body },
      throwOnError: false,
    });

    if (errors && errors.length > 0) {
      res.status(500).json({
        errors: errors.map((error) => ({
          message: error.error.message,
          type: "Student Register Workflow Error",
        })),
      });
      return;
    }

    res.status(201).json({
      message: "Student registered successfully",
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
