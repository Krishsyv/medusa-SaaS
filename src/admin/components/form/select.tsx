import { Label, Select as MedusaSelect } from "@medusajs/ui";
import { Controller, useFormContext } from "react-hook-form";
import { SelectProps } from "../../shared";

export const Select = ({
  name,
  label,
  rules,
  options,
  placeholder,
}: SelectProps) => {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({
        field: { value },
        fieldState: { error },
      }) => (
        <div className="flex flex-col gap-1">
        {label && (
            <Label htmlFor={name} className="text-ui-fg-subtle">
              {label}
            </Label>
          )}
        <MedusaSelect onValueChange={(value) => setValue(name, value)} value={value}>
          <MedusaSelect.Trigger>
            <MedusaSelect.Value placeholder={placeholder} />
          </MedusaSelect.Trigger>
          <MedusaSelect.Content>
            {options.map((item) => (
              <MedusaSelect.Item key={item.label} value={item.value}>
                {item.label}
              </MedusaSelect.Item>
            ))}
          </MedusaSelect.Content>
        </MedusaSelect>
        {error && <Label className="text-red-500">{error.message}</Label>}
        </div>
      )}
    />
  );
};

