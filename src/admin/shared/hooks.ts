import { useMemo } from "react";

class IdNameDto {
  id!: number;
  name!: string;
}

type CustomOptionProps = {
  labelProperty: string;
  valueProperty: string;
};

type UseOptionProps = {
  data: IdNameDto[] | any[] | undefined;
  custom?: CustomOptionProps | undefined;
};

const mapOptions = ({ data, custom }: UseOptionProps) =>
  data?.map((option) => ({
    label: custom ? option[custom.labelProperty] : option.name,
    value: custom ? option[custom.valueProperty] : option.id,
  })) ?? [];

export const useMemoOptions = ({ data, custom }: UseOptionProps) =>
  useMemo(() => mapOptions({ data, custom }), [data, custom]);
