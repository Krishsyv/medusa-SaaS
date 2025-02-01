import { model } from "@medusajs/framework/utils";
import { APP_ENTITY } from "src/constants"

// linked with student, class, section, language to maintain unique records
export const Portal = model
  .define(APP_ENTITY.portal, {
    id: model.id().primaryKey(),
    portal_id: model.text().unique().searchable(),
  })
  .indexes([
    {
      on: ["portal_id"],
    },
  ]);
