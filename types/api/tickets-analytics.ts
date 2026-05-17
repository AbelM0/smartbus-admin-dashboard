export interface TicketStatusItem {
  status: "PURCHASED" | "USED" | "EXPIRED" | "REFUNDED";
  count: number;
}

export interface TicketRouteItem {
  routeId: string;
  routeNumber: string;
  routeName: string;
  count: number;
}

export interface TicketAnalyticsResponse {
  success: boolean;
  data: {
    period: {
      from: string;
      to: string;
    };
    total: number;
    byStatus: TicketStatusItem[];
    byRoute: TicketRouteItem[];
    averageFare: number;
  };
}

export interface TicketAnalyticsParams {
  fromDate?: string;
  toDate?: string;
  routeId?: string;
  driverId?: string;
}
