export interface RevenueDayItem {
  date: string;
  revenue: number;
}

export interface RevenueRouteItem {
  routeId: string;
  routeNumber: string;
  routeName: string;
  revenue: number;
}

export interface RevenueResponse {
  success: boolean;
  data: {
    period: {
      from: string;
      to: string;
    };
    total: number;
    byDay: RevenueDayItem[];
    byRoute: RevenueRouteItem[];
  };
}


export interface RevenueParams {
  fromDate?: string;
  toDate?: string;
  routeId?: string;
  driverId?: string;
}
