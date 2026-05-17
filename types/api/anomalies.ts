export interface AnomalyItem {
  id: string;
  type: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: string;
  routeId?: string;
  routeName?: string;
  driverId?: string;
  driverName?: string;
  metadata?: Record<string, any>;
}

export interface AnomaliesResponse {
  success: boolean;
  data: {
    items: AnomalyItem[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface AnomaliesParams {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  routeId?: string;
  driverId?: string;
}
