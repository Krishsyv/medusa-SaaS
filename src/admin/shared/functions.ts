import _ from "lodash";

export const generateNumOptions = (num: number) =>
  _.range(1, num + 1).map((n) => ({ label: n, value: n }));

export const enumToOptions = (enumObj: any) => {
  return _.map(enumObj, (key, label) => ({
    label: label,
    value: key,
  }));
};
