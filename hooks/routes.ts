import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoutes, createRoute } from "@/api/routes/routes";
import { RoutesListParams, CreateRoutePayload } from "@/types/api/routes";
import { toast } from "sonner";

export const useGetRoutes = (params: RoutesListParams = {}) => {
  return useQuery({
    queryKey: ["routes", params],
    queryFn: () => getRoutes(params),
  });
};

export const useCreateRoute = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoutePayload) => createRoute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      toast.success("Route created successfully.");
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to create route.";
      toast.error(msg);
    },
  });
};
