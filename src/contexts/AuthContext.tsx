import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { registerUser } from "@/lib/auth.api";
import { verifyEmailApi, resendVerificationApi } from "@/lib/auth.api";
import { loginApi } from "@/lib/auth.api";
import axios from "axios";
import { toast } from '@/hooks/use-toast';
import { submitApplicationApi } from "@/lib/application.api";

export type UserStatus = 'unverified' | 'pending_application' | 'pending_review' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  status: UserStatus;
  applicationSubmittedAt?: Date;
  approvedAt?: Date;
  balance: number;
  pendingBalance: number;
  paypalEmail?: string;
  notifyOnSurveys: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (code: string) => Promise<User | null>;
  resendVerification: () => Promise<boolean>;
  submitApplication: (answers: Record<string, string>) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockApprovedUser: User = {
  id: '1',
  email: 'demo@insightpay.com',
  name: 'Demo User',
  emailVerified: true,
  status: 'approved',
  approvedAt: new Date('2024-01-15'),
  balance: 45.50,
  pendingBalance: 12.75,
  notifyOnSurveys: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('insightpay_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginApi({ email, password });
      const { user, token } = response.data;

      // Save token
      localStorage.setItem("access_token", token);

      // Save user
      setUser(user);
      localStorage.setItem("insightpay_user", JSON.stringify(user));
      return user; // return for redirect logic
    } catch (error: any) {
      throw error; // let caller handle toast
    } finally {
      setIsLoading(false);
    }
  };


  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/google-login");
      const { user, token } = response.data;

      localStorage.setItem("access_token", token);
      setUser(user);
      localStorage.setItem("insightpay_user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);

    try {
      console.log("[REGISTER] Sending request with payload:", { email, name });

      const response = await registerUser({ email, password, name });

      console.log(response);

      const { user, token } = response.data;

      localStorage.setItem("access_token", token);

      console.log("[REGISTER] Response from API:", response);

      const normalizedUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        status: user.status as UserStatus,
        balance: 0,
        pendingBalance: 0,
        notifyOnSurveys: true,
      };

      setUser(normalizedUser);
      localStorage.setItem("insightpay_user", JSON.stringify(normalizedUser));

      console.log("[REGISTER] User normalized and saved:", normalizedUser);

    } catch (error: any) {
      console.error("[REGISTER] Error object:", error);

      // Axios error logging
      if (axios.isAxiosError(error)) {
        console.error("[REGISTER] Axios error response:", error.response);
        console.error("[REGISTER] Axios error status:", error.response?.status);
        console.error("[REGISTER] Axios error headers:", error.response?.headers);
      }

      // Determine message to show in toast
      const description =
        (axios.isAxiosError(error) && error.response?.data?.message) ||
        error.message ||
        "Could not create account. Please try again.";

      toast({
        title: "Registration failed",
        description,
        variant: "destructive",
      });

      throw error; // Optional: rethrow if you want upstream handling
    } finally {
      setIsLoading(false);
      console.log("[REGISTER] isLoading set to false");
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('insightpay_user');
  };

  // Inside AuthProvider
  const verifyEmail = async (code: string): Promise<User | null> => {
    if (!user) return null;

    try {
      const response = await verifyEmailApi(code);
      const updatedUser = response.data.user;

      setUser(updatedUser);
      localStorage.setItem("insightpay_user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error?.response?.data?.message || "Could not verify your email.",
        variant: "destructive",
      });
      return null;
    }
  };


  const resendVerification = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await resendVerificationApi();

      if (response.success) {
        toast({
          title: "Code sent!",
          description: "A new verification code has been sent to your email.",
        });
        return true;
      }

      toast({
        title: "Failed to resend",
        description: response.message || "Could not send a new verification code.",
        variant: "destructive",
      });
      return false;
    } catch (error: any) {
      toast({
        title: "Failed to resend",
        description: error?.response?.data?.message || "Could not send a new verification code.",
        variant: "destructive",
      });
      return false;
    }
  };


  const submitApplication = async (answers: Record<string, string>) => {
    await submitApplicationApi(answers);

    if (user) {
      const updatedUser = {
        ...user,
        status: "application_submitted" as UserStatus,
      };

      setUser(updatedUser);
      localStorage.setItem("insightpay_user", JSON.stringify(updatedUser));
    }
  };


  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('insightpay_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
        verifyEmail,
        resendVerification,
        submitApplication,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
