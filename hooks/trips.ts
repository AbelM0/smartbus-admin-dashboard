import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTrips, createTrip, cancelTrip } from "@/api/trips/trips";
import { suggestDrivers } from "@/api/assignments/assignments";
import { TripsListParams, CreateTripPayload, AssignmentSuggestionsRequest } from "@/types/api/trips";
import { toast } from "sonner";

export const useGetTrips = (params: TripsListParams = {}) => {
  return useQuery({
    queryKey: ["trips", params],
    queryFn: () => getTrips(params),
  });
};

export const useCreateTrip = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTripPayload) => createTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Trip scheduled successfully.");
      onSuccess?.();
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      let msg = error?.response?.data?.message || "Failed to schedule trip.";
      if (status === 409) msg = "Driver already has a trip scheduled on this day.";
      if (status === 422) msg = "Selected driver is not currently active.";
      if (status === 404) msg = "Driver or route not found.";
      toast.error(msg);
    },
  });
};

export const useCancelTrip = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Trip cancelled successfully.");
      onSuccess?.();
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      let msg = error?.response?.data?.message || "Failed to cancel trip.";
      if (status === 400) msg = "Trip is not in SCHEDULED status.";
      toast.error(msg);
    },
  });
};

export const useSuggestDrivers = () => {
  return useMutation({
    mutationFn: (data: AssignmentSuggestionsRequest) => suggestDrivers(data),
    onError: (error: any) => {
      const status = error?.response?.status;
      let msg = "Failed to load driver suggestions.";
      if (status === 403) msg = "You are not authorized to view driver suggestions.";
      if (status === 401) msg = "Session expired. Please log in again.";
      toast.error(msg);
    },
  });
};
