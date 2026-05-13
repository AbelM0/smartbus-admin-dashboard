import apiClient from "@/lib/api-client";
import { 
  CreateRoutePayload, 
  CreateRouteResponse, 
  RoutesListParams, 
  RoutesListResponse 
} from "@/types/api/routes";

export const getRoutes = async (params: RoutesListParams = {}): Promise<RoutesListResponse> => {
  const cleanParams: Record<string, any> = {};
  Object.entries(params).forEach(([key, val]) => {
    if (val !== "" && val !== undefined && val !== null) {
      cleanParams[key] = val;
    }
  });
  const response = await apiClient.get<RoutesListResponse>("/api/v1/admin/routes", { params: cleanParams });
  return response.data;
};

export const createRoute = async (data: CreateRoutePayload): Promise<CreateRouteResponse> => {
  const response = await apiClient.post<CreateRouteResponse>("/api/v1/admin/routes", data);
  return response.data;
};
