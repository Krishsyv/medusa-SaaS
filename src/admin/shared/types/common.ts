export type IdNameDTO = {
  id: string;
  name: string;
};

export type IdNameResponse = {
  list: IdNameDTO[];
  count: number;
  limit: number;
  offset: number;
};
