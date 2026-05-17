import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoutes, searchRoutes, getRouteById, getRouteFare, createRoute, updateRoute, deleteRoute, updateRouteStops, updateRouteFares } from "@/api/routes/routes";
import { RoutesListParams, RouteSearchParams, RouteFareParams, CreateRoutePayload, UpdateRoutePayload, UpdateRouteStopsPayload, UpdateRouteFaresPayload } from "@/types/api/routes";
import { toast } from "sonner";

export const useGetRoutes = (params: RoutesListParams = {}) => {
  return useQuery({
    queryKey: ["routes", params],
    queryFn: () => getRoutes(params),
  });
};

export const useSearchRoutes = (params: RouteSearchParams = {}) => {
  return useQuery({
    queryKey: ["routes", "search", params],
    queryFn: () => searchRoutes(params),
  });
};

export const useGetRoute = (id: string | null) => {
  return useQuery({
    queryKey: ["routes", id],
    queryFn: () => getRouteById(id!),
    enabled: !!id,
  });
};

export const useGetRouteFare = (id: string | null, params: RouteFareParams) => {
  return useQuery({
    queryKey: ["routes", id, "fare", params],
    queryFn: () => getRouteFare(id!, params),
    enabled: !!id && !!params.boardingStopId && !!params.dropoffStopId,
    retry: false, // Don't retry if fare not found (404)
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

export const useUpdateRoute = (id: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRoutePayload) => updateRoute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["routes", id] });
      toast.success("Route updated successfully.");
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to update route.";
      toast.error(msg);
    },
  });
};

export const useDeleteRoute = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      toast.success("Route deleted successfully.");
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to delete route.";
      toast.error(msg);
    },
  });
};

export const useUpdateRouteStops = (id: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRouteStopsPayload) => updateRouteStops(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["routes", id] });
      toast.success("Route stops updated successfully.");
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to update route stops.";
      toast.error(msg);
    },
  });
};

export const useUpdateRouteFares = (id: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRouteFaresPayload) => updateRouteFares(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["routes", id] });
      toast.success("Route fares updated successfully.");
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to update route fares.";
      toast.error(msg);
    },
  });
};
