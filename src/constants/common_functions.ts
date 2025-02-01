import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

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
      [first_entity]: {
        [`${first_entity}_id`]: first_entity_id,
      },
      [second_entity]: {
        [`${second_entity}_id`]: second_entity_id,
      },
    });
  } catch (error) {
    return error;
  }
};

export const linkDelete = async (
  resolver: any, // req.scope or container
  { first_entity, first_entity_id, second_entity, second_entity_id }: LinkData
) => {
  try {
    const link = resolver.resolve(ContainerRegistrationKeys.LINK);
    await link.delete({
      [first_entity]: {
        [`${first_entity}_id`]: first_entity_id,
      },
      [second_entity]: {
        [`${second_entity}_id`]: second_entity_id,
      },
    });
  } catch (error) {
    return error;
  }
};
