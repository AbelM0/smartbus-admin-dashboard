import { User } from "@/types/api/auth";

export interface UsersListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  role?: "PASSENGER" | "DRIVER" | "ADMIN" | "SUPER_ADMIN" | "";
  status?: "ACTIVE" | "DISABLED" | "PENDING_VERIFICATION" | "";
  q?: string;
}

export interface UsersMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersListResponse {
  success: boolean;
  data: {
    items: User[];
    meta: UsersMeta;
  };
}

export interface CreateUserPayload {
  fullName: string;
  phone: string;
  email?: string;
  role: "PASSENGER" | "DRIVER" | "ADMIN" | "SUPER_ADMIN";
  password: string;
  fid?: string;
}

export interface CreateUserResponse {
  success: boolean;
  data?: User;
  message?: string;
}

export interface GetUserResponse {
  success: boolean;
  data: User;
}

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  data: User;
  message?: string;
}
