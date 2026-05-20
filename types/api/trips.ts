export type TripStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Trip {
  id: string;
  routeId: string;
  driverId: string;
  busIdentifier: string;
  status: TripStatus;
  startedAt: string | null;
  endedAt: string | null;
  scheduledFor: string;
  createdAt: string;
  updatedAt: string;
  route: {
    id: string;
    routeNumber: string;
    name: string;
  };
  driver: {
    id: string;
    fullName: string;
    phone: string;
  };
}

export interface TripsListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: TripStatus | "";
  routeId?: string;
  driverId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface TripsListResponse {
  success: boolean;
  data: {
    items: Trip[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CreateTripPayload {
  routeId: string;
  driverId: string;
  scheduledFor: string;
  busIdentifier: string;
}

export type AssignmentSuggestionsRequest = {
  routeId: string;
  scheduledFor: string; // ISO 8601
};

export type DriverSuggestion = {
  driverId: string;
  driverName: string;
  confidence: number; // 0.0-1.0
  reasons: string[];
};

export type AssignmentSuggestionsResponse = {
  success: boolean;
  data: {
    routeId: string;
    source: "ml" | "fallback";
    suggestions: DriverSuggestion[];
  };
};
