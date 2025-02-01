import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../lib/sdk"; // Ensure SDK is configured properly
import { toast } from "@medusajs/ui";

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
		experimental_prefetchInRender: true,
		throwOnError: true,
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
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
      toast.success(successMessage || "Created successfully!");
    },
    onError: (error) => {
      console.error("Post error:", error);
      toast.error("Failed to create.");
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
      return sdk.client.fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        body: data,
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
      toast.success(successMessage || "Updated successfully!");
    },
    onError: (error) => {
      console.error("Patch error:", error);
      toast.error("Failed to update.");
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
      return sdk.client.fetch(`${endpoint}/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
      toast.success(successMessage || "Deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete.");
    },
  });
};
