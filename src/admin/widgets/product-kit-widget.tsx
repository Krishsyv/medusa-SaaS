import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { KitSection, ClassKitSection } from "../components";

const ProductWidget = () => {
  return (
    <>
      <KitSection />
      <ClassKitSection />
    </>
  );
};

export const config = defineWidgetConfig({
  zone: "product.list.after",
});

export default ProductWidget;
