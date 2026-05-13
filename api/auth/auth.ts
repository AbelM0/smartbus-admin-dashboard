import { BASE_URL } from "@/lib/base-url";
import { ClientSignIn, ClientSignInResponse } from "@/types/api/auth";
import axios from "axios";
import apiClient from "@/lib/api-client";

export const signIn = async (data: ClientSignIn): Promise<ClientSignInResponse> => {
  try {
    const sendReq = await axios.post<ClientSignInResponse>(
      `${BASE_URL}/api/v1/auth/login`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const reqRes = await sendReq.data;
    return reqRes;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Login error response:", error.response?.data);
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("Unexpected error");
  }
};

export const signOut = async (refreshToken: string): Promise<void> => {
  await apiClient.post("/api/v1/auth/logout", { refreshToken });
};
