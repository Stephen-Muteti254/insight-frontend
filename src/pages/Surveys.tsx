import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Clock, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { getAvailableSurveys, startSurvey as startSurveyApi } from '@/lib/survey.api';


function SurveySkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="h-5 w-2/3 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          </div>
          <div className="h-10 w-24 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
}


export default function Surveys() {
  const { user, updateUser } = useAuth();

  const [surveys, setSurveys] = useState<any[]>([]);
  const [activeSurvey, setActiveSurvey] = useState<any | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAvailableSurveys()
      .then(setSurveys)
      .finally(() => setIsLoading(false));
  }, []);

  const visibleSurveys = surveys.filter(
    (s) => s.isActive && s.slotsRemaining > 0
  );

  const startSurvey = async (survey: any) => {
    try {
      await startSurveyApi(survey.id); // backend slot decrement
      setActiveSurvey(survey);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            completeSurvey();
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    } catch {
      toast({
        title: 'Survey unavailable',
        description: 'This survey no longer has available slots.',
        variant: 'destructive',
      });
    }
  };

  const completeSurvey = () => {
    if (!activeSurvey || !user) return;

    updateUser({
      pendingBalance: (user.pendingBalance || 0) + activeSurvey.reward,
    });

    toast({
      title: 'Survey Completed!',
      description: `$${activeSurvey.reward.toFixed(2)} added to pending balance.`,
    });

    setActiveSurvey(null);
    setProgress(0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Active Survey Modal */}
        {activeSurvey && (
          <Card className="border-primary">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Survey in Progress</h3>
                <Badge variant="processing">Active</Badge>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-muted-foreground text-center">
                {progress < 100 ? 'Completing survey...' : 'Survey complete!'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Available Surveys</h1>
          </div>
        </div>

        {/* Surveys Grid */}
        <div className="grid grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <SurveySkeleton />
              <SurveySkeleton />
              <SurveySkeleton />
            </>
          ) : surveys.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No surveys available at the moment. Please check back later.
              </CardContent>
            </Card>
          ) : (
            surveys.map((survey) => (
              <Card
                key={survey.id}
                variant="interactive"
                onClick={() => startSurvey(survey)}
                className="cursor-pointer hover:border-primary/30"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{survey.title}</h3>
                        <Badge variant="secondary">{survey.topic}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {survey.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {survey.slotsRemaining} spots left
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent">
                          ${survey.reward.toFixed(2)}
                        </p>
                        {/*<p className="text-xs text-muted-foreground">reward</p>*/}
                      </div>
                      {/*<Button
                        variant="hero"
                        onClick={(e) => {
                          e.stopPropagation();
                          startSurvey(survey);
                        }}
                        disabled={activeSurvey !== null}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>*/}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
