import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Mail, Loader2, RefreshCw } from 'lucide-react';
import { routeForStatus } from '@/utils/statusRedirect';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { user, verifyEmail, resendVerification } = useAuth();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const updatedUser = await verifyEmail(code);

      if (updatedUser) {
        navigate(routeForStatus(updatedUser.status));
        toast({
          title: "Email verified",
          description: "Your email has been successfully verified.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      await resendVerification();
    } finally {
      setIsResending(false);
    }
  };


  return (
    <AuthLayout 
      title="Verify your email" 
      description="We sent a verification code to your email"
    >
      <Card variant="glass">
        <CardContent className="p-6 space-y-6">
          {/* Email Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Info Text */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit code to
            </p>
            <p className="font-medium">{user?.email || 'your email'}</p>
            <p className="text-xs text-muted-foreground">
              For demo purposes, use code: <span className="font-mono font-bold">123456</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Verify Button */}
          <Button
            variant="hero"
            className="w-full"
            onClick={handleVerify}
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>

          {/* Resend Link */}
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={isResending}
              className="text-muted-foreground"
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend code
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
