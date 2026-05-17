import apiClient from "@/lib/api-client";
import { ExportParams } from "@/types/api/reports";

export const exportAnalyticsData = async (params: ExportParams): Promise<Blob> => {
  const response = await apiClient.get("/api/v1/admin/reports/export", {
    params,
    responseType: "blob",
  });
  return response.data;
};
