import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";
import AcademyModule from "src/modules/academy";

// Extend Data Model link
export default defineLink(
  CustomerModule.linkable.customer,
  AcademyModule.linkable.student
);
