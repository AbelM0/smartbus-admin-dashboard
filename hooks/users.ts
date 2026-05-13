import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, getUserById, createUser, updateUser, disableUser, enableUser } from "@/api/users/users";
import { UsersListParams, CreateUserPayload, UpdateUserPayload } from "@/types/api/users";
import { toast } from "sonner";

export const useGetUsers = (params: UsersListParams = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
};

export const useGetUser = (id: string | null) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });
};

export const useCreateUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserPayload) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully.");
      onSuccess?.();
    },
  });
};

export const useUpdateUser = (id: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserPayload) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User profile updated successfully.");
      onSuccess?.();
    },
  });
};

export const useDisableUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => disableUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User account disabled.");
      onSuccess?.();
    },
  });
};

export const useEnableUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enableUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User account re-enabled.");
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to enable user.";
      toast.error(msg);
    },
  });
};
