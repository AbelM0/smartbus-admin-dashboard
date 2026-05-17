import apiClient from "@/lib/api-client";
import { AuditLogsParams, AuditLogsResponse } from "@/types/api/audit";

export const getAuditLogs = async (params: AuditLogsParams = {}): Promise<AuditLogsResponse> => {
  const response = await apiClient.get<AuditLogsResponse>("/api/v1/admin/actions", { params });
  return response.data;
};
