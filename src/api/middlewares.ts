import { Modules } from "@medusajs/framework/utils";
import { authenticate, defineMiddlewares, MedusaRequest } from "@medusajs/framework/http";
import { AuthenticatedRequest, APP_MODULE } from "src/constants";
import AcademyService from "src/modules/academy/service";


export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/*",
      middlewares: [
        async (req: MedusaRequest, res, next) => {
          try {
            const auth_req = req as AuthenticatedRequest;
            if (auth_req.auth_context && auth_req.auth_context?.actor_id) {
              const customerService = req.scope.resolve(Modules.CUSTOMER);
              const academyService: AcademyService = req.scope.resolve(
                APP_MODULE.ACADEMY
              );
              console.log("auth_req.auth_context", auth_req.auth_context)
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
            res.status(500).json({ message: "Error in validating User" });
          }
        },
      ],
    },
  ],
});
