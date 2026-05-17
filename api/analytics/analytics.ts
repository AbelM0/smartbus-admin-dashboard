import apiClient from "@/lib/api-client";
import { AnalyticsParams, AnalyticsResponse } from "@/types/api/analytics";
import { RevenueParams, RevenueResponse } from "@/types/api/revenue";
import { TicketAnalyticsParams, TicketAnalyticsResponse } from "@/types/api/tickets-analytics";
import { TripAnalyticsParams, TripAnalyticsResponse } from "@/types/api/trips-analytics";
import { AnomaliesParams, AnomaliesResponse } from "@/types/api/anomalies";

export const getAnalytics = async (params: AnalyticsParams = {}): Promise<AnalyticsResponse> => {
  const response = await apiClient.get<AnalyticsResponse>("/api/v1/admin/analytics/dashboard", { params });
  return response.data;
};

export const getRevenueBreakdown = async (params: RevenueParams = {}): Promise<RevenueResponse> => {
  const response = await apiClient.get<RevenueResponse>("/api/v1/admin/analytics/revenue", { params });
  return response.data;
};

export const getTicketAnalytics = async (params: TicketAnalyticsParams = {}): Promise<TicketAnalyticsResponse> => {
  const response = await apiClient.get<TicketAnalyticsResponse>("/api/v1/admin/analytics/tickets", { params });
  return response.data;
};

export const getTripAnalytics = async (params: TripAnalyticsParams = {}): Promise<TripAnalyticsResponse> => {
  const response = await apiClient.get<TripAnalyticsResponse>("/api/v1/admin/analytics/trips", { params });
  return response.data;
};

export const getAnomalies = async (params: AnomaliesParams = {}): Promise<AnomaliesResponse> => {
  const response = await apiClient.get<AnomaliesResponse>("/api/v1/admin/analytics/anomalies", { params });
  return response.data;
};
