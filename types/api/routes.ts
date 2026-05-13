export interface RouteStop {
  name: string;
  sequence: number;
  latitude: number;
  longitude: number;
}

export interface RouteFare {
  fromStopSequence: number;
  toStopSequence: number;
  amount: number;
}

export interface RouteSegment {
  fromStopSequence: number;
  toStopSequence: number;
  distance: number;
  duration: number;
}

export interface CreateRoutePayload {
  routeNumber: string;
  name: string;
  description?: string;
  estimatedDuration: number;
  estimatedDistance: number;
  stops: RouteStop[];
  fares: RouteFare[];
  segments?: RouteSegment[];
}

export interface Route extends CreateRoutePayload {
  id: string;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  createdAt: string;
  updatedAt: string;
}

export interface CreateRouteResponse {
  success: boolean;
  data: Route;
  message?: string;
}

export interface RoutesListParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
}

export interface RoutesListResponse {
  success: boolean;
  data: {
    items: Route[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
