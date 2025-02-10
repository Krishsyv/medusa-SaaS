import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { APP_MODULE, linkEntities } from "src/constants";

createProductsWorkflow.hooks.productsCreated(
  async ({ products, additional_data }, { container }) => {
    const productService = container.resolve(Modules.PRODUCT);
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

    for (const product of products) {
      await productService.upsertProducts([
        { id: product.id, metadata: { portal_id: additional_data?.portal_id } },
      ]);

      logger.info(`Updated metadata for product ${product.id}`);
      await linkEntities(container, {
        first_entity: Modules.PRODUCT,
        first_entity_id: product.id,
        second_entity: APP_MODULE.PORTAL,
        second_entity_id: additional_data?.portal_id as string,
      });
      logger.info(
        `linked product ${product.id} with portal ${additional_data?.portal_id}`
      );
    }
  }
);
