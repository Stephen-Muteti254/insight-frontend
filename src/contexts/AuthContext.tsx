import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  verifyEmail: (code: string) => Promise<boolean>;
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo: use mock approved user
    const loggedInUser = { ...mockApprovedUser, email };
    setUser(loggedInUser);
    localStorage.setItem('insightpay_user', JSON.stringify(loggedInUser));
    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const googleUser = { ...mockApprovedUser, email: 'google.user@gmail.com', name: 'Google User' };
    setUser(googleUser);
    localStorage.setItem('insightpay_user', JSON.stringify(googleUser));
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      emailVerified: false,
      status: 'unverified',
      balance: 0,
      pendingBalance: 0,
      notifyOnSurveys: true,
    };
    
    setUser(newUser);
    localStorage.setItem('insightpay_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('insightpay_user');
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (code === '123456' && user) {
      const updatedUser = { ...user, emailVerified: true, status: 'pending_application' as UserStatus };
      setUser(updatedUser);
      localStorage.setItem('insightpay_user', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const submitApplication = async (answers: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      const updatedUser = { 
        ...user, 
        status: 'pending_review' as UserStatus,
        applicationSubmittedAt: new Date()
      };
      setUser(updatedUser);
      localStorage.setItem('insightpay_user', JSON.stringify(updatedUser));
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
