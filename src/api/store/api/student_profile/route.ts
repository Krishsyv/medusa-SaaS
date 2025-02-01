import { MedusaResponse } from "@medusajs/framework/http";
import {
  APP_ENTITY,
  APP_MODULE,
  AuthenticatedRequest,
  StudentProfileInput,
  studentProfileSchema,
  StudentProfileSchema,
} from "src/constants";
import AcademyService from "src/modules/academy/service";

export async function PATCH(req: AuthenticatedRequest, res: MedusaResponse) {
  try {
    studentProfileSchema.parse(req.body as StudentProfileSchema);
    const body = req.body as StudentProfileInput;
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );

    const [get_student] = await academyService.listStudents(
      {
        portal_id: req.portal_id,
        student_enrollment_code: req.student_enrollment_code,
      },
      { relations: [APP_ENTITY.student_profile] }
    );
    
    if (!get_student.student_profile) {
      const create_student_profile = await academyService.createStudentProfiles({
        ...body,
        portal_id: req.portal_id,
        student: get_student.id,
        student_enrollment_code: req.student_enrollment_code,
        student_name: body.student_name || get_student.student_name,
      });
      
      res.status(201).json(create_student_profile);
      return;
    }
    
    const update_student = await academyService.updateStudents({
      ...body,
      student: get_student.id,
      student_name: body.student_name || get_student.student_name,
    });

    res.status(200).json(update_student);
  } catch (error) {
    res.json(error);
  }
}

export async function GET(req: AuthenticatedRequest, res: MedusaResponse) {
  try {
    const academyService: AcademyService = req.scope.resolve(
      APP_MODULE.ACADEMY
    );

    const [get_student] = await academyService.listStudents(
      {
        portal_id: req.portal_id,
        student_enrollment_code: req.student_enrollment_code,
      },
      { relations: [APP_ENTITY.student_profile] }
    );
		
    res.status(200).json({ get_student });
  } catch (error) {
    res.json(error);
  }
}
