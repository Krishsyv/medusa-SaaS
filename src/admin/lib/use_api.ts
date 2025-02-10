import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import { toast } from "@medusajs/ui";
import { API_TYPE } from "../shared";

export const useGetData = <T>(
  key: string,
  endpoint: string,
  params?: object
) => {
  return useQuery<T>({
    queryKey: [key, params],
    queryFn: async () => {
      return sdk.client.fetch(endpoint, { query: params });
    },
  });
};

export const usePostData = <T>(
  key: string,
  endpoint: string,
  successMessage?: string
) => {
  const queryClient = useQueryClient();
  return useMutation<T, unknown, object>({
    mutationFn: async (data) => {
      return sdk.client.fetch(endpoint, {
        method: API_TYPE.POST,
        body: data,
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
      toast.success(successMessage || "Created successfully!");
    },
    onError: (error: any) => {
      console.error("Post error:", error);
      toast.error(error.message || "Failed to create");
    },
  });
};

export const usePatchData = <T>(
  key: string,
  endpoint: string,
  successMessage?: string
) => {
  const queryClient = useQueryClient();
  return useMutation<T, unknown, { id: string; data: object }>({
    mutationFn: async ({ id, data }) => {
      return sdk.client.fetch(`${endpoint}?id=${id}`, {
        method: API_TYPE.PATCH,
        body: data,
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
      toast.success(successMessage || "Updated successfully!");
    },
    onError: (error: any) => {
      console.error("Patch error:", error);
      toast.error(error.message || "Failed to update");
    },
  });
};

export const useDeleteData = (
  key: string,
  endpoint: string,
  successMessage?: string
) => {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: async (id) => {
      return sdk.client.fetch(`${endpoint}?id=${id}`, {
        method: API_TYPE.DELETE,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
      toast.success(successMessage || "Deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete");
    },
  });
};

