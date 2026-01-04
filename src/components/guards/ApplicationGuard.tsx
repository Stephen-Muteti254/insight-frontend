import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ApplicationGuardProps {
  children: ReactNode;
}

export function ApplicationGuard({ children }: ApplicationGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If email is not verified, redirect to verification page
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // If application not submitted yet, redirect to application page
  if (user.status === 'pending_application') {
    return <Navigate to="/application" replace />;
  }

  // If application is pending review, redirect to pending page
  if (user.status === 'pending_review') {
    return <Navigate to="/pending-review" replace />;
  }

  // If application was rejected
  if (user.status === 'rejected') {
    return <Navigate to="/application-rejected" replace />;
  }

  return <>{children}</>;
}
