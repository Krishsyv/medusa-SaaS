import { generateNumOptions } from "../functions";
import _ from "lodash";

export const useKitForm = () => {
  const kit_fields = [
    {
      type: "select",
      label: "Product ID",
      name: "product_id",
      // options: productOptions,
      rules: { required: "Product ID is required" },
    },
    {
      type: "select",
      label: "Quantity",
      name: "qty",
      options: generateNumOptions(10),
      rules: { required: "Quantity is required" },
    },
    {
      type: "select",
      label: "Status",
      name: "status",
      options: [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
      ],
      rules: { required: "Status is required" },
    },
  ];

  return { kit_fields };
};
