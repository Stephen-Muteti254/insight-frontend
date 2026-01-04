import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle2, Mail } from 'lucide-react';

export default function PendingReview() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  // Demo function to simulate approval
  const handleDemoApproval = () => {
    updateUser({ status: 'approved', approvedAt: new Date() });
    navigate('/surveys');
  };

  return (
    <AuthLayout 
      title="Application Under Review" 
      description="We're reviewing your application"
    >
      <Card variant="glass">
        <CardContent className="p-8 space-y-6 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-warning/10">
              <Clock className="h-10 w-10 text-warning" />
            </div>
          </div>

          {/* Status Message */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Your Application is Being Reviewed</h3>
            <p className="text-muted-foreground">
              Thank you for submitting your application! Our team is currently reviewing your 
              profile to ensure the best experience for you.
            </p>
          </div>

          {/* Timeline */}
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-4 text-left">
              <div className="p-2 rounded-full bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Account Created</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-left">
              <div className="p-2 rounded-full bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Email Verified</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-left">
              <div className="p-2 rounded-full bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Application Submitted</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-left">
              <div className="p-2 rounded-full bg-warning/10 animate-pulse">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-medium">Under Review</p>
                <p className="text-sm text-muted-foreground">Usually takes 24-48 hours</p>
              </div>
            </div>
          </div>

          {/* Notification Info */}
          <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-secondary/50">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              We'll email you at <span className="font-medium">{user?.email}</span> when your application is reviewed.
            </p>
          </div>

          {/* Demo Button */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">
              Demo Mode: Click below to simulate approval
            </p>
            <Button variant="hero" onClick={handleDemoApproval}>
              Simulate Approval
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
