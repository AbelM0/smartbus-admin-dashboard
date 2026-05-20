import apiClient from "@/lib/api-client";
import { AssignmentSuggestionsRequest, AssignmentSuggestionsResponse } from "@/types/api/trips";

export const suggestDrivers = async (data: AssignmentSuggestionsRequest): Promise<AssignmentSuggestionsResponse> => {
  const response = await apiClient.post<AssignmentSuggestionsResponse>("/api/v1/admin/assignments/suggest", data);
  return response.data;
};
