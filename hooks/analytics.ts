import { useQuery } from "@tanstack/react-query";
import { getAnalytics, getRevenueBreakdown, getTicketAnalytics, getTripAnalytics, getAnomalies } from "@/api/analytics/analytics";
import { AnalyticsParams } from "@/types/api/analytics";
import { RevenueParams } from "@/types/api/revenue";
import { TicketAnalyticsParams } from "@/types/api/tickets-analytics";
import { TripAnalyticsParams } from "@/types/api/trips-analytics";
import { AnomaliesParams } from "@/types/api/anomalies";

export const useGetAnalytics = (params: AnalyticsParams = {}) => {
  return useQuery({
    queryKey: ["analytics", params],
    queryFn: () => getAnalytics(params),
  });
};

export const useGetRevenueBreakdown = (params: RevenueParams = {}) => {
  return useQuery({
    queryKey: ["revenue-breakdown", params],
    queryFn: () => getRevenueBreakdown(params),
  });
};

export const useGetTicketAnalytics = (params: TicketAnalyticsParams = {}) => {
  return useQuery({
    queryKey: ["tickets-analytics", params],
    queryFn: () => getTicketAnalytics(params),
  });
};

export const useGetTripAnalytics = (params: TripAnalyticsParams = {}) => {
  return useQuery({
    queryKey: ["trips-analytics", params],
    queryFn: () => getTripAnalytics(params),
  });
};

export const useGetAnomalies = (params: AnomaliesParams = {}) => {
  return useQuery({
    queryKey: ["anomalies", params],
    queryFn: () => getAnomalies(params),
  });
};
