import { Clock, AlertTriangle, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SurveyHeaderProps {
  title: string;
  reward: number;
  formattedTime: string;
  timeRemaining: number;
  isExpired: boolean;
}

export function SurveyHeader({ 
  title, 
  reward, 
  formattedTime, 
  timeRemaining,
  isExpired 
}: SurveyHeaderProps) {
  const isLowTime = timeRemaining <= 60 && timeRemaining > 0; // Less than 1 minute
  const isCriticalTime = timeRemaining <= 30 && timeRemaining > 0; // Less than 30 seconds

  return (
    <div className="space-y-4">
      {/* Title and Reward Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
        <Badge 
          variant="outline" 
          className="flex items-center gap-2 px-4 py-2 text-lg bg-accent/10 border-accent text-accent self-start sm:self-auto"
        >
          <DollarSign className="h-5 w-5" />
          Earn ${reward.toFixed(2)}
        </Badge>
      </div>

      {/* Timer Display */}
      <div className={cn(
        "flex items-center gap-3 p-4 rounded-lg border transition-colors",
        isExpired && "bg-destructive/10 border-destructive",
        isCriticalTime && !isExpired && "bg-destructive/10 border-destructive animate-pulse",
        isLowTime && !isCriticalTime && "bg-warning/10 border-warning",
        !isLowTime && !isExpired && "bg-secondary border-border"
      )}>
        <Clock className={cn(
          "h-6 w-6",
          isExpired || isCriticalTime ? "text-destructive" : isLowTime ? "text-warning" : "text-primary"
        )} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
            <span className={cn(
              "text-2xl font-mono font-bold tabular-nums",
              isExpired || isCriticalTime ? "text-destructive" : isLowTime ? "text-warning" : "text-foreground"
            )}>
              {isExpired ? "00:00" : formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Important:</strong> You must complete this survey in one session. 
          Leaving or refreshing this page may forfeit your reward.
        </AlertDescription>
      </Alert>
    </div>
  );
}
