export interface ClientSignIn {
  identifier: string;
  identifierType: "PHONE" | "EMAIL";
  password: string;
}

export interface User {
  id: string;
  role: string;
  status: string;
  fullName: string;
  phone: string;
  email: string | null;
  fid: string | null;
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
