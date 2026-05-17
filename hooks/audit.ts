import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "@/api/audit/audit";
import { AuditLogsParams } from "@/types/api/audit";

export const useGetAuditLogs = (params: AuditLogsParams = {}) => {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params),
  });
};
