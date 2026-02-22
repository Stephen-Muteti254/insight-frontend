import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, DollarSign, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const recentEarnings = [
  { id: 1, title: 'Consumer Habits Survey', amount: 2.50, date: '2024-01-28', status: 'paid' },
  { id: 2, title: 'Technology Usage Study', amount: 3.75, date: '2024-01-27', status: 'paid' },
  { id: 3, title: 'Shopping Preferences', amount: 1.25, date: '2024-01-26', status: 'pending' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const totalEarnings = (user?.balance || 0) + (user?.pendingBalance || 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold text-accent">${user?.balance?.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">${user?.pendingBalance?.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Earnings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Earnings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/wallet">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEarnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{earning.title}</p>
                    <p className="text-sm text-muted-foreground">{earning.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={earning.status as 'paid' | 'pending'}>{earning.status}</Badge>
                    <span className="font-semibold text-accent">${earning.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
