import { useNavigate } from 'react-router-dom';
import { Clock, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

interface SurveyExpiredModalProps {
  isOpen: boolean;
  redirectPath?: string;
  redirectDelay?: number; // in seconds
}

export function SurveyExpiredModal({ 
  isOpen, 
  redirectPath = '/surveys',
  redirectDelay = 5 
}: SurveyExpiredModalProps) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(redirectDelay);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(redirectPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, navigate, redirectPath]);

  const handleRedirectNow = () => {
    navigate(redirectPath);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Clock className="h-8 w-8 text-destructive" />
          </div>
          <DialogTitle className="text-xl">Time Expired</DialogTitle>
          <DialogDescription className="text-center space-y-2">
            <p>Your time to complete this survey has expired.</p>
            <p className="text-muted-foreground">
              The slot has been released for other users.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 pt-4">
          <Button onClick={handleRedirectNow} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Surveys
          </Button>
          <p className="text-xs text-muted-foreground">
            Redirecting in {countdown} seconds...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SurveyErrorCardProps {
  title: string;
  message: string;
  onBack?: () => void;
}

export function SurveyErrorCard({ title, message, onBack }: SurveyErrorCardProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/surveys');
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="py-8">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{title}</h3>
            <p className="text-muted-foreground mt-1">{message}</p>
          </div>
          <Button onClick={handleBack} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Surveys
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
