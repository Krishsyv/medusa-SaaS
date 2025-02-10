import { TextInput, Select } from "./form";
import { SelectProps, TextInputProps } from "../shared";

enum FieldType {
  text = "text",
  select = "select",
  password = "password",
}

interface RenderFormProps {
  field: TextInputProps & SelectProps | Record<string, any>;
}

export const RenderForm: React.FC<RenderFormProps> = ({ field }) => {
  switch (field.type) {
    case FieldType.text || FieldType.password:
      return (
        <TextInput
          name={field.name}
          type={field.type}
          label={field.label}
          rules={field.rules}
          disabled={field.disabled}
          placeholder={`Enter ${field.label}`}
        />
      );
    case FieldType.select:
      return (
        <Select
          name={field.name}
          label={field.label}
          options={field.options}
          rules={field.rules}
        />
      );
    default:
      return null;
  }
};
