export type TextInputProps = {
  name: string;
  type?: string;
  label?: string;
  styles?: string;
  disabled?: boolean;
  placeholder?: string;
  rules: Record<string, any>;
};

export type SelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  rules?: Record<string, any>;
  options: SelectOptions[];
};

export type SelectOptions = {
  value: string | number | boolean;
  label: string | number;
};
