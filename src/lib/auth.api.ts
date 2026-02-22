// lib/auth.api.ts
import api from "@/lib/api";
import axios from "axios";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      emailVerified: boolean;
      status: string;
      createdAt: string;
    };
    token: string;
  };
}

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Registration failed";
      throw new Error(message);
    }
    throw error;
  }
};


export interface VerifyEmailResponse {
  success: boolean;
  message?: string;
}

export const verifyEmailApi = async (code: string): Promise<VerifyEmailResponse> => {
  const { data } = await api.post("/auth/verify-email", { code });
  return data;
};

export const resendVerificationApi = async (): Promise<VerifyEmailResponse> => {
  const { data } = await api.post("/auth/resend-verification");
  return data;
};


export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const { data } = await api.post("/auth/login", payload);
    console.log(data);
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    }
    throw error;
  }
};