import { Controller, useFormContext } from "react-hook-form";
import { Input, Label } from "@medusajs/ui";

type TextInputProps = {
  name: string;
  label?: string;
  disabled?: boolean;
  rules?: any;
  placeholder?: string;
  styles?: string;
};

export const TextInput = ({
  name,
  label,
  disabled = false,
  rules,
  placeholder,
  styles = "",
}: TextInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => (
        <div className="flex flex-col gap-1">
          {label && (
            <Label htmlFor={name} className="text-ui-fg-subtle">
              {label}
            </Label>
          )}
          <Input
            id={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value || ""}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full ${styles}`}
          />
          {error && <Label className="text-red-500">{error.message}</Label>}
        </div>
      )}
    />
  );
};
