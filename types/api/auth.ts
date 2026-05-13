export interface ClientSignIn {
  identifier: string;
  identifierType: "PHONE" | "EMAIL";
  password: string;
}

export interface User {
  id: string;
  role: "PASSENGER" | "DRIVER" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "DISABLED" | "PENDING_VERIFICATION";
  fullName: string;
  phone: string;
  email: string | null;
  fid: string | null;
  fcmToken: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ClientSignInResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
  message?: string;
}
