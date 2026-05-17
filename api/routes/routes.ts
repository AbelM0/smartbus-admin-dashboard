import apiClient from "@/lib/api-client";
import Cookies from "js-cookie";
import {
  CreateRoutePayload,
  CreateRouteResponse,
  RouteDetailResponse,
  RouteFareParams,
  RoutesListParams,
  RoutesListResponse,
  RouteSearchParams,
  UpdateRoutePayload,
  UpdateRouteStopsPayload,
  UpdateRouteFaresPayload,
} from "@/types/api/routes";


// ─── Shared response normaliser ────────────────────────────────────────────────
function normaliseRoutesResponse(raw: any): RoutesListResponse {
  // Shape: raw array
  if (Array.isArray(raw)) {
    return {
      data: raw,
      meta: { total: raw.length, page: 1, limit: raw.length, totalPages: 1 },
    };
  }
  // Shape: { success, data: { items: [...], meta: {...} } }  ← actual server response
  if (raw?.data?.items && Array.isArray(raw.data.items)) {
    return {
      data: raw.data.items,
      meta: raw.data.meta ?? {
        total: raw.data.items.length,
        page: 1,
        limit: raw.data.items.length,
        totalPages: 1,
      },
    };
  }
  // Shape: { data: [...] }
  if (raw?.data && Array.isArray(raw.data)) {
    return {
      data: raw.data,
      meta: raw.meta ?? { total: raw.data.length, page: 1, limit: raw.data.length, totalPages: 1 },
    };
  }
  // Shape: { items: [...] }
  if (raw?.items && Array.isArray(raw.items)) {
    return {
      data: raw.items,
      meta: {
        total: raw.total ?? raw.items.length,
        page: raw.page ?? 1,
        limit: raw.limit ?? raw.items.length,
        totalPages: raw.totalPages ?? 1,
      },
    };
  }
  // Fallback
  return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
}

// ─── Strip empty/null/undefined params before sending ──────────────────────────
function cleanParams(params: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  Object.entries(params).forEach(([key, val]) => {
    if (val !== "" && val !== undefined && val !== null) out[key] = val;
  });
  return out;
}

// ─── GET /api/v1/routes ────────────────────────────────────────────────────────
export const getRoutes = async (params: RoutesListParams = {}): Promise<RoutesListResponse> => {
  const response = await apiClient.get<any>("/api/v1/routes", { params: cleanParams(params) });
  return normaliseRoutesResponse(response.data);
};

// ─── GET /api/v1/routes/search ────────────────────────────────────────────────
export const searchRoutes = async (params: RouteSearchParams = {}): Promise<RoutesListResponse> => {
  const response = await apiClient.get<any>("/api/v1/routes/search", { params: cleanParams(params) });
  return normaliseRoutesResponse(response.data);
};

// ─── GET /api/v1/routes/{id} ──────────────────────────────────────────────────
export const getRouteById = async (id: string): Promise<RouteDetailResponse> => {
  const response = await apiClient.get<RouteDetailResponse>(`/api/v1/routes/${id}`);
  return response.data;
};

// ─── GET /api/v1/routes/{id}/fare ─────────────────────────────────────────────
export const getRouteFare = async (id: string, params: RouteFareParams): Promise<number> => {
  const token = Cookies.get("accessToken");
  const response = await apiClient.get<any>(`/api/v1/routes/${id}/fare`, { 
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
  // The response might be just a number or wrapped in `{ success: true, data: 2000 }`
  if (response.data && typeof response.data.data === "number") {
    return response.data.data;
  }
  return response.data as number;
};

// ─── POST /api/v1/admin/routes ────────────────────────────────────────────────
export const createRoute = async (data: CreateRoutePayload): Promise<CreateRouteResponse> => {
  const response = await apiClient.post<CreateRouteResponse>("/api/v1/admin/routes", data);
  return response.data;
};

// ─── PATCH /api/v1/admin/routes/{id} ──────────────────────────────────────────
export const updateRoute = async (id: string, data: UpdateRoutePayload): Promise<RouteDetailResponse> => {
  const response = await apiClient.patch<RouteDetailResponse>(`/api/v1/admin/routes/${id}`, data);
  return response.data;
};

// ─── DELETE /api/v1/admin/routes/{id} ─────────────────────────────────────────
export const deleteRoute = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/v1/admin/routes/${id}`);
};

// ─── PUT /api/v1/admin/routes/{id}/stops ──────────────────────────────────────
export const updateRouteStops = async (id: string, data: UpdateRouteStopsPayload): Promise<RouteDetailResponse> => {
  const response = await apiClient.put<RouteDetailResponse>(`/api/v1/admin/routes/${id}/stops`, data);
  return response.data;
};

// ─── PUT /api/v1/admin/routes/{id}/fares ──────────────────────────────────────
export const updateRouteFares = async (id: string, data: UpdateRouteFaresPayload): Promise<RouteDetailResponse> => {
  const response = await apiClient.put<RouteDetailResponse>(`/api/v1/admin/routes/${id}/fares`, data);
  return response.data;
};

