import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSurvey } from '@/hooks/useSurvey';
import { useSurveyTimer } from '@/hooks/useSurveyTimer';
import { SurveyHeader } from './SurveyHeader';
import { SurveyAttachments } from './SurveyAttachments';
import { SurveyIframe } from './SurveyIframe';
import { SurveyCompletion } from './SurveyCompletion';
import { SurveyExpiredModal, SurveyErrorCard } from './SurveyExpired';
import { SurveySuccess } from './SurveySuccess';

export function SurveyRunner() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  
  const {
    survey,
    state,
    expiresAt,
    error,
    rewardCredited,
    fetchSurvey,
    startSurvey,
    completeSurvey,
  } = useSurvey();

  const handleExpire = useCallback(() => {
    // Timer expired - state will be handled by the modal
  }, []);

  const { 
    formattedTime, 
    timeRemaining, 
    isExpired, 
    percentElapsed 
  } = useSurveyTimer({
    expiresAt,
    onExpire: handleExpire,
  });

  // Fetch survey on mount
  useEffect(() => {
    if (surveyId) {
      fetchSurvey(surveyId);
    }
  }, [surveyId, fetchSurvey]);

  // Handle start survey
  const handleStartSurvey = async () => {
    if (surveyId) {
      await startSurvey(surveyId);
    }
  };

  // Handle complete survey
  const handleCompleteSurvey = async () => {
    if (surveyId) {
      await completeSurvey(surveyId);
    }
  };

  // Loading state
  if (state === 'loading' && !survey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading survey...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state === 'error' && error) {
    return (
      <div className="container max-w-4xl py-8">
        <SurveyErrorCard title="Error" message={error.message} />
      </div>
    );
  }

  // Success state
  if (state === 'completed' && rewardCredited !== null) {
    return (
      <div className="container max-w-4xl py-8">
        <SurveySuccess reward={rewardCredited} surveyTitle={survey?.title} />
      </div>
    );
  }

  // Ready state - show survey info and start button
  if (state === 'ready' && survey) {
    return (
      <div className="container max-w-4xl py-8 space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/surveys')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Surveys
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{survey.title}</h1>
            <p className="text-muted-foreground mt-1">{survey.topic}</p>
          </div>

          {/* Survey info card */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-2xl font-bold text-foreground">{survey.durationMinutes} min</p>
              <p className="text-sm text-muted-foreground">Duration</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 text-center">
              <p className="text-2xl font-bold text-accent">${survey.reward.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Reward</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-2xl font-bold text-foreground">{survey.slotsRemaining}</p>
              <p className="text-sm text-muted-foreground">Slots Remaining</p>
            </div>
          </div>

          {/* Description */}
          {survey.description && (
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
              <div className="text-muted-foreground whitespace-pre-line">
                {survey.description}
              </div>
            </div>
          )}

          {/* Attachments */}
          <SurveyAttachments attachments={survey.attachments} />

          <Separator />

          {/* Start button */}
          <div className="text-center py-4">
            <Button 
              size="xl" 
              variant="hero"
              onClick={handleStartSurvey}
              className="min-w-[200px]"
            >
              Start Survey
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              By clicking Start, you confirm you can complete this survey in one session.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // In-progress state - show survey runner
  if ((state === 'in_progress' || state === 'completing') && survey) {
    return (
      <div className="container max-w-5xl py-6 space-y-6">
        {/* Expired modal */}
        <SurveyExpiredModal isOpen={isExpired} />

        {/* Header with timer */}
        <SurveyHeader
          title={survey.title}
          reward={survey.reward}
          formattedTime={formattedTime}
          timeRemaining={timeRemaining}
          isExpired={isExpired}
        />

        {/* Description (collapsed) */}
        {survey.description && (
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              View Survey Description
            </summary>
            <div className="mt-2 p-4 rounded-lg bg-secondary/30 text-sm text-muted-foreground whitespace-pre-line">
              {survey.description}
            </div>
          </details>
        )}

        {/* Attachments (if any) */}
        <SurveyAttachments attachments={survey.attachments} />

        {/* Survey iframe */}
        <SurveyIframe externalUrl={survey.externalUrl} title={survey.title} />

        {/* Completion section */}
        <SurveyCompletion
          isCompleting={state === 'completing'}
          percentElapsed={percentElapsed}
          onComplete={handleCompleteSurvey}
        />
      </div>
    );
  }

  // Fallback
  return (
    <div className="container max-w-4xl py-8">
      <SurveyErrorCard 
        title="Survey Not Found" 
        message="The survey you're looking for doesn't exist or has been removed." 
      />
    </div>
  );
}
