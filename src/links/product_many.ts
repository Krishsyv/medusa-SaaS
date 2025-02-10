import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import AcademyModule from "src/modules/academy";
import PortalModule from "src/modules/portal";

// Extend Data Model link
export const product_kit = defineLink(
  ProductModule.linkable.product,
  AcademyModule.linkable.kit
);

export const product_portal = defineLink(
  ProductModule.linkable.product,
  PortalModule.linkable.portal
);
