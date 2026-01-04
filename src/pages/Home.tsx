import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Shield,
  ArrowRight,
  Star,
  Users,
  TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Get Paid Fairly',
    description: 'See your earnings before you start. No hidden rates, no surprises.',
  },
  {
    icon: Clock,
    title: 'Flexible Schedule',
    description: 'Complete surveys on your own time, from anywhere in the world.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Fast, reliable PayPal withdrawals with transparent processing.',
  },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '$2M+', label: 'Paid Out' },
  { value: '4.8', label: 'Average Rating', icon: Star },
];

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in seconds with your email or Google account.',
  },
  {
    number: '02',
    title: 'Complete Application',
    description: 'Answer a few quick questions to verify your profile.',
  },
  {
    number: '03',
    title: 'Start Earning',
    description: 'Browse available surveys and earn money for your insights.',
  },
];

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent/5 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-up">
              <TrendingUp className="h-4 w-4" />
              Join 50,000+ users earning with InsightPay
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Share Your Insights,{' '}
              <span className="text-gradient-hero">Earn Money</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Complete surveys on topics you care about and get paid instantly. Know exactly what you'll earn before you start.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/register">
                  Start Earning Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 pt-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {stat.icon && <stat.icon className="h-5 w-5 text-warning fill-warning" />}
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose InsightPay?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe your time and opinions are valuable. That's why we offer transparent, fair compensation for every survey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={feature.title} variant="elevated" className="animate-fade-up" style={{ animationDelay: `${0.1 * index}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started is quick and easy. Begin earning in just a few simple steps.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={step.number} className="relative text-center animate-fade-up" style={{ animationDelay: `${0.1 * index}s` }}>
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                  
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-bold mb-4 relative z-10">
                    {step.number}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Ready to Start Earning?</h2>
            <p className="text-primary-foreground/80">
              Join thousands of users who are already earning money by sharing their valuable insights.
            </p>
            <Button variant="secondary" size="xl" asChild className="bg-background text-foreground hover:bg-background/90">
              <Link to="/register">
                Create Free Account
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
