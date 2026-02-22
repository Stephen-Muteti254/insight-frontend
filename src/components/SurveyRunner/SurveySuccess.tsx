import { useNavigate } from 'react-router-dom';
import { CheckCircle, DollarSign, ArrowLeft, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SurveySuccessProps {
  reward: number;
  surveyTitle?: string;
}

export function SurveySuccess({ reward, surveyTitle }: SurveySuccessProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto mt-8 animate-scale-in">
      <Card className="border-accent/30 bg-accent/5 overflow-hidden">
        {/* Success header with animation */}
        <div className="bg-accent/10 p-6 text-center relative overflow-hidden">
          {/* Confetti-like decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-2 left-[10%] w-2 h-2 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="absolute top-4 left-[30%] w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            <div className="absolute top-2 right-[20%] w-2 h-2 bg-warning/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="absolute top-6 right-[35%] w-1 h-1 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          
          <div className="relative z-10">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 ring-4 ring-accent/30">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
            <PartyPopper className="absolute top-4 right-4 h-6 w-6 text-warning animate-bounce" />
          </div>
        </div>

        <CardContent className="py-8 text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Survey Completed Successfully!
            </h2>
            {surveyTitle && (
              <p className="text-muted-foreground mt-1 text-sm">
                {surveyTitle}
              </p>
            )}
          </div>

          {/* Reward display */}
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-accent/10 border border-accent/20">
            <DollarSign className="h-8 w-8 text-accent" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Reward Credited</p>
              <p className="text-3xl font-bold text-accent">
                ${reward.toFixed(2)}
              </p>
            </div>
          </div>

          <p className="text-muted-foreground text-sm">
            The reward has been added to your pending balance. 
            It will be available for withdrawal after verification.
          </p>

          <Button 
            onClick={() => navigate('/surveys')} 
            size="lg"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Surveys
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
