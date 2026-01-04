import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Clock, DollarSign, Play, CheckCircle, AlertCircle } from 'lucide-react';

const availableSurveys = [
  { id: 1, title: 'Consumer Shopping Habits 2024', topic: 'Retail', duration: 8, reward: 2.00, slots: 45 },
  { id: 2, title: 'Technology & Privacy Attitudes', topic: 'Technology', duration: 12, reward: 3.50, slots: 12 },
  { id: 3, title: 'Health & Wellness Lifestyle', topic: 'Health', duration: 5, reward: 1.25, slots: 89 },
  { id: 4, title: 'Financial Planning Survey', topic: 'Finance', duration: 15, reward: 4.00, slots: 23 },
  { id: 5, title: 'Entertainment Preferences', topic: 'Media', duration: 6, reward: 1.50, slots: 156 },
];

export default function Surveys() {
  const { user, updateUser } = useAuth();
  const [activeSurvey, setActiveSurvey] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const startSurvey = (surveyId: number) => {
    setActiveSurvey(surveyId);
    setProgress(0);
    
    // Simulate survey progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeSurvey(surveyId);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const completeSurvey = (surveyId: number) => {
    const survey = availableSurveys.find(s => s.id === surveyId);
    if (survey && user) {
      updateUser({ pendingBalance: (user.pendingBalance || 0) + survey.reward });
      toast({
        title: "Survey Completed!",
        description: `$${survey.reward.toFixed(2)} added to your pending balance.`,
      });
    }
    setActiveSurvey(null);
    setProgress(0);
  };

  // Show first withdrawal notification
  const showWithdrawalNotice = (user?.balance || 0) + (user?.pendingBalance || 0) >= 5 && 
    !localStorage.getItem('withdrawal_notice_shown');

  if (showWithdrawalNotice) {
    localStorage.setItem('withdrawal_notice_shown', 'true');
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* First $5 Notice */}
        {showWithdrawalNotice && (
          <Card className="border-accent/50 bg-accent/5">
            <CardContent className="p-4 flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-accent" />
              <div className="flex-1">
                <h3 className="font-semibold text-accent">Congratulations!</h3>
                <p className="text-sm text-muted-foreground">You've reached $5. You can now withdraw your earnings!</p>
              </div>
              <Button variant="accent" size="sm" asChild>
                <a href="/wallet">Withdraw</a>
              </Button>
            </CardContent>
          </Card>
        )}

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
            <p className="text-muted-foreground">{availableSurveys.length} surveys available</p>
          </div>
        </div>

        {/* Surveys Grid */}
        <div className="grid gap-4">
          {availableSurveys.map((survey) => (
            <Card key={survey.id} variant="interactive" className="hover:border-primary/30">
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
                        {survey.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {survey.slots} spots left
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent">${survey.reward.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">reward</p>
                    </div>
                    <Button 
                      variant="hero" 
                      onClick={() => startSurvey(survey.id)}
                      disabled={activeSurvey !== null}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
