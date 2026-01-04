import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, ClipboardCheck } from 'lucide-react';

const questions = [
  {
    id: 'experience',
    question: 'Have you participated in online surveys before?',
    type: 'radio',
    options: ['Yes, frequently', 'Yes, occasionally', 'No, this is my first time'],
  },
  {
    id: 'motivation',
    question: 'Why do you want to join InsightPay?',
    type: 'radio',
    options: ['Earn extra income', 'Share my opinions', 'Both'],
  },
  {
    id: 'availability',
    question: 'How much time can you dedicate to surveys per week?',
    type: 'radio',
    options: ['Less than 2 hours', '2-5 hours', '5-10 hours', 'More than 10 hours'],
  },
  {
    id: 'bio',
    question: 'Tell us a bit about yourself (interests, profession, etc.)',
    type: 'textarea',
    placeholder: 'I am a...',
  },
];

export default function Application() {
  const navigate = useNavigate();
  const { submitApplication } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all questions answered
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      toast({
        title: "Please complete all questions",
        description: `${unanswered.length} question(s) remaining.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await submitApplication(answers);
      toast({
        title: "Application submitted!",
        description: "We'll review your application and get back to you soon.",
      });
      navigate('/pending-review');
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Could not submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  return (
    <AuthLayout 
      title="Complete Your Application" 
      description="Help us learn more about you"
    >
      <Card variant="glass">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ClipboardCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Quick Application</CardTitle>
              <CardDescription>This helps us match you with relevant surveys</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Important Notice */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-info/10 border border-info/20">
            <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-info">Why is this important?</p>
              <p className="text-muted-foreground mt-1">
                Your answers help us verify you're a real person and match you with surveys 
                that fit your profile. Honest, thoughtful responses lead to better survey opportunities.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((q, index) => (
              <div key={q.id} className="space-y-3">
                <Label className="text-sm font-medium">
                  {index + 1}. {q.question}
                </Label>

                {q.type === 'radio' && q.options && (
                  <RadioGroup
                    value={answers[q.id] || ''}
                    onValueChange={(value) => handleAnswer(q.id, value)}
                    className="space-y-2"
                  >
                    {q.options.map((option) => (
                      <div key={option} className="flex items-center space-x-3">
                        <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                        <label
                          htmlFor={`${q.id}-${option}`}
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {q.type === 'textarea' && (
                  <Textarea
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    rows={3}
                    className="bg-secondary/30 border-border/50"
                  />
                )}
              </div>
            ))}

            <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
