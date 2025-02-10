import { MedusaRequest } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { updateLinksWorkflow } from "@medusajs/medusa/core-flows";
import { AuthenticatedRequest, APP_MODULE, ACTOR_TYPE } from "src/constants";
import AcademyService from "src/modules/academy/service";
import AdminUserService from "src/modules/admin_user/service";

type LinkData = {
  first_entity: string;
  first_entity_id: string;
  second_entity: string;
  second_entity_id: string;
};
// in api send req.scope as container
export const linkEntities = async (
  resolver: any, // req.scope or container
  { first_entity, first_entity_id, second_entity, second_entity_id }: LinkData
) => {
  try {
    const link = resolver.resolve(ContainerRegistrationKeys.LINK);
    await link.create({
      [first_entity]: { [`${first_entity}_id`]: first_entity_id },
      [second_entity]: { [`${second_entity}_id`]: second_entity_id },
    });
  } catch (error) {
    return { error };
  }
};

export const linkDelete = async (
  resolver: any, // req.scope or container
  { first_entity, first_entity_id, second_entity, second_entity_id }: LinkData
) => {
  try {
    const link = resolver.resolve(ContainerRegistrationKeys.LINK);
    await link.delete({
      [first_entity]: { [`${first_entity}_id`]: first_entity_id },
      [second_entity]: { [`${second_entity}_id`]: second_entity_id },
    });
  } catch (error) {
    return error;
  }
};

export const updateLinks = async (
  resolver: any, // req.scope or container
  { first_entity, first_entity_id, second_entity, second_entity_id }: LinkData
) => {
  try {
    const { result, errors } = await updateLinksWorkflow(resolver).run({
      input: [
        {
          [first_entity]: { [`${first_entity}_id`]: first_entity_id },
          [second_entity]: { [`${second_entity}_id`]: second_entity_id },
        },
      ],
    });

    return { result, errors };
  } catch (error) {
    return error;
  }
};

// for student, customer is default actor_type
export const setCustomerAuthContextRequest = async (
  req: MedusaRequest,
  res,
  next
) => {
  try {
    const auth_req = req as AuthenticatedRequest;
    if (auth_req.auth_context && auth_req.auth_context?.actor_id) {
      const customerService = req.scope.resolve(Modules.CUSTOMER);
      const academyService: AcademyService = req.scope.resolve(
        APP_MODULE.ACADEMY
      );
      const get_customer = await customerService.retrieveCustomer(
        auth_req.auth_context.actor_id
      );
      const get_student = await academyService.retrieveStudent(
        get_customer.email
      );
      auth_req.portal_id = get_student.portal_id;
      auth_req.student_enrollment_code = get_student.student_enrollment_code;
      next();
    }
  } catch (error) {
    res.status(500).json({ message: "Error in validating Customer" });
  }
};

// for admin, user is default actor_type
export const setUserAuthContextRequest = async (
  req: MedusaRequest,
  res,
  next
) => {
  try {
    const auth_req = req as AuthenticatedRequest;
    if (auth_req.auth_context && auth_req.auth_context?.actor_id) {
      const userService = req.scope.resolve(Modules.USER);
      const adminUserService: AdminUserService = req.scope.resolve(
        APP_MODULE.ADMIN_USER
      );
      const get_user = await userService.retrieveUser(
        auth_req.auth_context.actor_id
      );
      const get_admin_user = await adminUserService.retrieveAdminUser(
        get_user.email
      );

      auth_req.portal_id = get_admin_user.portal_id;
      auth_req.email = get_admin_user.email;
      req.scope.register({
        [APP_MODULE.ADMIN_USER]: {
          resolve: () => get_admin_user,
        },
      });
      next();
    }
  } catch (error) {
    res.status(500).json({ message: "Error in validating User" });
  }
};
