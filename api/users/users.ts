import apiClient from "@/lib/api-client";
import { UsersListParams, UsersListResponse, CreateUserPayload, CreateUserResponse, GetUserResponse, UpdateUserPayload, UpdateUserResponse } from "@/types/api/users";

export const getUsers = async (params: UsersListParams = {}): Promise<UsersListResponse> => {
  const cleanParams: Record<string, any> = {};
  Object.entries(params).forEach(([key, val]) => {
    if (val !== "" && val !== undefined && val !== null) {
      cleanParams[key] = val;
    }
  });
  const response = await apiClient.get<UsersListResponse>("/api/v1/admin/users", { params: cleanParams });
  return response.data;
};

export const getUserById = async (id: string): Promise<GetUserResponse> => {
  const response = await apiClient.get<GetUserResponse>(`/api/v1/admin/users/${id}`);
  return response.data;
};

export const createUser = async (data: CreateUserPayload): Promise<CreateUserResponse> => {
  const response = await apiClient.post<CreateUserResponse>("/api/v1/admin/users", data);
  return response.data;
};

export const updateUser = async (id: string, data: UpdateUserPayload): Promise<UpdateUserResponse> => {
  const response = await apiClient.patch<UpdateUserResponse>(`/api/v1/admin/users/${id}`, data);
  return response.data;
};

export const disableUser = async (id: string): Promise<UpdateUserResponse> => {
  const response = await apiClient.patch<UpdateUserResponse>(`/api/v1/admin/users/${id}/disable`);
  return response.data;
};

export const enableUser = async (id: string): Promise<UpdateUserResponse> => {
  const response = await apiClient.patch<UpdateUserResponse>(`/api/v1/admin/users/${id}/enable`);
  return response.data;
};

export interface UserMetrics {
  tripCompletionRate: number;
  averageTripDelayMinutes: number;
  averagePassengerLoad: number;
  recentAssignmentCount: number;
  anomalyRate: number;
  peakHourRatio: number;
  peakHourBinary: number;
}

export interface UserMetricsResponse {
  success: boolean;
  data: UserMetrics;
}

export const getUserMetrics = async (id: string): Promise<UserMetricsResponse> => {
  const response = await apiClient.get<UserMetricsResponse>(
    `/api/v1/admin/users/${id}/metrics`
  );
  return response.data;
};
