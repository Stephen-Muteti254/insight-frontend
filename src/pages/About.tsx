import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Users, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Transparency',
    description: 'We believe in clear, upfront communication about earnings, timelines, and expectations.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Our users are at the heart of everything we do. Your feedback shapes our platform.',
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Your data is protected with enterprise-grade security. We never sell your information.',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'Earn from anywhere in the world. Our platform is designed to be inclusive and accessible.',
  },
];

const benefits = [
  'See payment amounts before starting surveys',
  'Flexible scheduling - work when you want',
  'Quick PayPal withdrawals',
  'Diverse survey topics',
  'Fair compensation for your time',
  'Supportive community',
];

export default function About() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              About <span className="text-gradient-primary">InsightPay</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We're on a mission to create the most transparent and rewarding survey platform, 
              where your time and opinions are truly valued.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    InsightPay was founded with a simple belief: people deserve to know what they'll 
                    earn before investing their time. Too many survey platforms leave users guessing 
                    about compensation.
                  </p>
                  <p>
                    We built InsightPay to be different. Transparent earnings, fair compensation, 
                    and reliable payments are the foundation of everything we do.
                  </p>
                  <p>
                    Today, we connect thousands of users with businesses seeking genuine insights, 
                    creating value for everyone involved.
                  </p>
                </div>
              </div>
              
              <Card variant="glass" className="p-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Why Users Love InsightPay</h3>
                  <ul className="space-y-3">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make at InsightPay.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={value.title} variant="elevated" className="animate-fade-up" style={{ animationDelay: `${0.1 * index}s` }}>
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Join Our Community</h2>
            <p className="text-muted-foreground">
              Start earning today with InsightPay. Create your free account and complete your first survey.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
