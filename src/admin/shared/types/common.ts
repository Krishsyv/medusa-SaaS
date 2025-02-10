export enum CLASS_KIT_TYPE {
  OPEN = "open",
  CLOSED = "closed",
}

export enum DEFAULT_KEYS {
  created_at = "Created At",
  updated_at = "Updated At",
}

export type NameInput = {
  name: string;
};

export type IdKey = {
  id: string;
};

export type ListResponse = {
  list: Record<string, any>[];
  count: number;
  limit: number;
  offset: number;
};

export type KitInput = {
  product_id: string;
  qty: number;
  status?: boolean;
};

export type ClassKitInput = {
  kit_id: string;
  class_id: string;
  type: CLASS_KIT_TYPE;
  is_customizable: boolean;
  second_language: string;
  third_language?: string;
  third_language_status?: boolean;
  status?: boolean;
};

export type DefaultKeys = {
  created_at: string;
  updated_at: string;
};

export type CreateProps = {
  label: string;
  open: boolean;
  queryKey: string;
  endpoint: string;
  heading: string;
  setOpen: (open: boolean) => void;
  onRefetch?: () => void;
};
