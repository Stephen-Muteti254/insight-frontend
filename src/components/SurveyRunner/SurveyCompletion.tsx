import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface SurveyCompletionProps {
  isCompleting: boolean;
  percentElapsed: number;
  minPercentRequired?: number; // Default 20%
  onComplete: () => void;
}

export function SurveyCompletion({ 
  isCompleting, 
  percentElapsed, 
  minPercentRequired = 20,
  onComplete 
}: SurveyCompletionProps) {
  const canComplete = percentElapsed >= minPercentRequired;
  const timeUntilEnabled = Math.max(0, minPercentRequired - percentElapsed);

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
      <CardContent className="py-6">
        <div className="text-center space-y-4">
          <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Finished the Survey?
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Click below once you've completed all survey questions.
            </p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="lg" 
                className={cn(
                  "gap-2 min-w-[200px]",
                  canComplete && "bg-accent hover:bg-accent/90"
                )}
                disabled={!canComplete || isCompleting}
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    I Have Completed the Survey
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Survey Completion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you've completed all survey questions? 
                  This action cannot be undone, and you won't be able to retake this survey.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Go Back</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onComplete}
                  className="bg-accent hover:bg-accent/90"
                >
                  Yes, I'm Done
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {!canComplete && (
            <p className="text-xs text-muted-foreground">
              Completion available after {Math.ceil(timeUntilEnabled)}% of time has elapsed
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
