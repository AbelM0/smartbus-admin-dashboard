import apiClient from "@/lib/api-client";
import { TripsListParams, TripsListResponse, CreateTripPayload } from "@/types/api/trips";

// ─── GET /api/v1/admin/trips ─────────────────────────────────────────────────
export const getTrips = async (params?: TripsListParams): Promise<TripsListResponse> => {
  const response = await apiClient.get<TripsListResponse>("/api/v1/admin/trips", { params });
  return response.data;
};

// ─── POST /api/v1/admin/trips ────────────────────────────────────────────────
export const createTrip = async (data: CreateTripPayload): Promise<void> => {
  await apiClient.post("/api/v1/admin/trips", data);
};

// ─── PATCH /api/v1/admin/trips/{id}/cancel ───────────────────────────────────
export const cancelTrip = async (id: string): Promise<void> => {
  await apiClient.patch(`/api/v1/admin/trips/${id}/cancel`);
};
