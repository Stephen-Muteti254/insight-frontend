import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle, Mail } from 'lucide-react';

export default function ApplicationRejected() {
  return (
    <AuthLayout 
      title="Application Not Approved" 
      description=""
    >
      <Card variant="glass">
        <CardContent className="p-8 space-y-6 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-destructive/10">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Application Not Approved</h3>
            <p className="text-muted-foreground">
              We're sorry, but we couldn't approve your application at this time. 
              This could be due to incomplete information or our current survey needs.
            </p>
          </div>

          {/* What to do */}
          <div className="p-4 rounded-lg bg-secondary/50 text-left">
            <h4 className="font-medium mb-2">What can you do?</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Ensure your profile information is complete and accurate</li>
              <li>• You may reapply after 30 days</li>
              <li>• Contact support if you believe this was an error</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button variant="hero" asChild className="w-full">
              <Link to="/contact">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
