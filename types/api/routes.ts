export interface RouteStop {
  id: string;
  name: string;
  sequence: number;
  latitude: number;
  longitude: number;
  distanceFromPrevious?: number | null;
  distanceToNext?: number | null;
  durationFromPrevious?: number | null;
  durationToNext?: number | null;
}

export interface RouteFare {
  fromStopId: string;
  toStopId: string;
  fromStopSequence: number;
  toStopSequence: number;
  amount: number;
}

export interface Route {
  id: string;
  routeNumber: string;
  name: string;
  description?: string;
  isActive: boolean;
  duration: number;
  distance: number;
  startStopName: string;
  endStopName: string;
  totalStops: number;
  price: number;
  stops: RouteStop[];
  fares?: RouteFare[];
  createdAt: string;
  updatedAt: string;
}

// ---- List params ----
export interface RoutesListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  q?: string;
}

// ---- Search params (superset of list params) ----
export interface RouteSearchParams extends RoutesListParams {
  departure?: string;   // departure stop name
  destination?: string; // destination stop name
}

// ---- List response ----
export interface RoutesListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RoutesListResponse {
  // The API returns a paginated wrapper — we normalise to a consistent shape.
  // Actual shape: array at root OR { data: Route[], meta: {...} }
  data: Route[];
  meta: RoutesListMeta;
}

// ---- Create ----
export interface CreateRouteStopInput {
  name: string;
  sequence: number;
  latitude: number;
  longitude: number;
}

export interface CreateRouteFareInput {
  fromStopSequence: number;
  toStopSequence: number;
  amount: number;
}

export interface CreateRouteSegmentInput {
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
  stops: CreateRouteStopInput[];
  fares: CreateRouteFareInput[];
  segments?: CreateRouteSegmentInput[];
}

export interface CreateRouteResponse {
  success: boolean;
  data: Route;
  message?: string;
}

// ---- Update ----
export interface UpdateRoutePayload {
  name?: string;
  description?: string;
  isActive?: boolean;
  estimatedDuration?: number;
  estimatedDistance?: number;
}

export interface UpdateRouteStopsPayload {
  stops: CreateRouteStopInput[];
}

export interface UpdateRouteFaresPayload {
  fares: CreateRouteFareInput[];
}

// ---- Single route (detail) ----
export interface RouteDetailResponse {
  success: boolean;
  data: Route;
}

// ---- Fare lookup ----
export interface RouteFareParams {
  boardingStopId: string;
  dropoffStopId: string;
}


