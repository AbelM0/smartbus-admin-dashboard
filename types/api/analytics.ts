export interface AnalyticsData {
  period: {
    from: string;
    to: string;
  };
  totalUsers: number;
  activeUsersInPeriod: number;
  totalTicketsPurchased: number;
  totalTicketsUsed: number;
  totalTicketsExpired: number;
  totalTicketsRefunded: number;
  totalRevenue: number;
  totalRefunds: number;
  netRevenue: number;
  totalTrips: number;
  totalScans: number;
  anomalyCount: number;
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

export interface AnalyticsParams {
  fromDate?: string;
  toDate?: string;
  routeId?: string;
  driverId?: string;
}

