export interface TripStatusItem {
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  count: number;
}

export interface TripRouteItem {
  routeId: string;
  routeNumber: string;
  routeName: string;
  count: number;
}

export interface TripDriverItem {
  driverId: string;
  driverName: string;
  count: number;
}

export interface TripAnalyticsResponse {
  success: boolean;
  data: {
    period: {
      from: string;
      to: string;
    };
    total: number;
    byStatus: TripStatusItem[];
    byRoute: TripRouteItem[];
    byDriver: TripDriverItem[];
  };
}

export interface TripAnalyticsParams {
  fromDate?: string;
  toDate?: string;
  routeId?: string;
  driverId?: string;
}
